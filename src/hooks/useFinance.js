import { useState, useEffect } from 'react';

export function useFinance() {
  const [salary, setSalary] = useState(() => {
    return Number(localStorage.getItem('cts_salary')) || 0;
  });

  const [cutoffDay, setCutoffDay] = useState(() => {
    return Number(localStorage.getItem('cts_cutoffDay')) || 30;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('cts_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [fixedExpenses, setFixedExpenses] = useState(() => {
    const saved = localStorage.getItem('cts_fixedExpenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Nuevo estado para los ingresos extras
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('cts_incomes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSimulatingAll, setIsSimulatingAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('cts_salary', salary);
    localStorage.setItem('cts_cutoffDay', cutoffDay);
    localStorage.setItem('cts_expenses', JSON.stringify(expenses));
    localStorage.setItem('cts_fixedExpenses', JSON.stringify(fixedExpenses));
    localStorage.setItem('cts_incomes', JSON.stringify(incomes));
  }, [salary, cutoffDay, expenses, fixedExpenses, incomes]);

  const totalPaidFixed = fixedExpenses
    .filter(item => isSimulatingAll || item.paid)
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const totalFixed = fixedExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

  // Sumar el total de ingresos extras
  const totalIncomes = incomes.reduce((acc, item) => acc + Number(item.amount), 0);

  const netSalary = salary - totalPaidFixed;
  const totalSpent = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  
  // El total restante ahora incluye los ingresos extras sumados
  const totalRemaining = netSalary - totalSpent + totalIncomes;

  // Cálculo exacto de los días restantes usando el calendario legal
  const getDaysRemaining = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const validCutoff = cutoffDay && cutoffDay > 0 && cutoffDay <= 31 ? cutoffDay : 30;

    let targetDate = new Date(currentYear, currentMonth, validCutoff);

    if (currentDay > validCutoff) {
      targetDate = new Date(currentYear, currentMonth + 1, validCutoff);
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 1;
  };

  const daysLeft = getDaysRemaining();

  // Filtrar los gastos hechos estrictamente HOY (desde las 00:00 hrs)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const spentToday = expenses
    .filter(item => item.timestamp && item.timestamp >= startOfToday.getTime())
    .reduce((acc, item) => acc + Number(item.amount), 0);

  // Reconstruimos el remanente antes del gasto de hoy para sacar la cuota exacta que te tocaba hoy
  const remainingBeforeToday = totalRemaining + spentToday;
  const baseDailyAllowance = daysLeft > 0 ? Math.round(remainingBeforeToday / daysLeft) : 0;

  // Disponible para hoy: Lo que te tocaba hoy menos lo que gastaste hoy
  const dailyBudget = baseDailyAllowance - spentToday;

  const updateSettings = (newSalary, newCutoffDay) => {
    setSalary(newSalary);
    setCutoffDay(newCutoffDay);
  };

  const addFixedExpense = (title, amount) => {
    const newItem = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: Number(amount),
      paid: false
    };
    setFixedExpenses([newItem, ...fixedExpenses]);
  };

  const toggleFixedPaid = (id) => {
    setFixedExpenses(fixedExpenses.map(item => 
      item.id === id ? { ...item, paid: !item.paid } : item
    ));
  };

  const deleteFixedExpense = (id) => {
    setFixedExpenses(fixedExpenses.filter(item => item.id !== id));
  };

  const addExpense = (amount, description) => {
    const newExpense = {
      id: Date.now().toString(),
      amount: Number(amount),
      description: description || 'Gasto rápido',
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };
  const deleteIncome = (id) => {
  setIncomes(incomes.filter(item => item.id !== id));
};

  // Función para agregar un ingreso extra
  const addIncome = (amount, description) => {
    const newIncome = {
      id: Date.now().toString(),
      amount: Number(amount),
      description: description || 'Ingreso extra',
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setIncomes([newIncome, ...incomes]);
  };

  const resetData = () => {
    setSalary(0);
    setExpenses([]);
    setFixedExpenses([]);
    setIncomes([]);
    localStorage.clear();
  };

  return {
    salary,
    netSalary,
    cutoffDay,
    expenses,
    fixedExpenses,
    incomes,
    totalFixed,
    totalSpent,
    totalIncomes,
    totalRemaining,
    daysLeft,
    dailyBudget,
    isSimulatingAll,
    setIsSimulatingAll,
    updateSettings,
    addFixedExpense,
    toggleFixedPaid,
    deleteFixedExpense,
    addExpense,
    deleteExpense,
    addIncome,
    resetData
  };
}