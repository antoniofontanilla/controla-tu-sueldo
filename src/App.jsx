import { useState } from 'react';
import { useFinance } from './hooks/useFinance';
import Dashboard from './components/Dashboard';
import SetupModal from './components/SetupModal';

export default function App() {
  const {
    salary,
    netSalary,
    cutoffDay,
    expenses,
    fixedExpenses,
    totalFixed,
    totalSpent,
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
    resetData
  } = useFinance();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showModal = salary === 0 || isSettingsOpen;

  const handleSaveSettings = (newSalary, newCutoffDay) => {
    updateSettings(newSalary, newCutoffDay);
    setIsSettingsOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de reiniciar todos tus datos, sueldo y gastos fijos?')) {
      resetData();
      setIsSettingsOpen(true);
    }
  };

  return (
    <>
      <Dashboard
        salary={salary}
        netSalary={netSalary}
        cutoffDay={cutoffDay}
        expenses={expenses}
        fixedExpenses={fixedExpenses}
        totalFixed={totalFixed}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
        daysLeft={daysLeft}
        dailyBudget={dailyBudget}
        isSimulatingAll={isSimulatingAll}
        setIsSimulatingAll={setIsSimulatingAll}
        onAddFixed={addFixedExpense}
        onToggleFixedPaid={toggleFixedPaid}
        onDeleteFixed={deleteFixedExpense}
        onAddExpense={addExpense}
        onDeleteExpense={deleteExpense}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
      />

      {showModal && (
        <SetupModal
          initialSalary={salary}
          initialCutoff={cutoffDay}
          onSave={handleSaveSettings}
        />
      )}
    </>
  );
}