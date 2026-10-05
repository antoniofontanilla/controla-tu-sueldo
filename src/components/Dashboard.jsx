import { useState } from 'react';
import { Wallet, Calendar, TrendingDown, RefreshCw, Settings, PlusCircle } from 'lucide-react';
import { formatCLP } from '../utils/formatters';
import ExpenseForm from './ExpenseForm';
import ExpenseHistory from './ExpenseHistory';
import FixedExpenses from './FixedExpenses';

export default function Dashboard({
  salary,
  netSalary,
  cutoffDay,
  expenses,
  incomes = [],
  fixedExpenses,
  totalFixed,
  totalSpent,
  totalRemaining,
  daysLeft,
  dailyBudget,
  isSimulatingAll,
  setIsSimulatingAll,
  onAddFixed,
  onToggleFixedPaid,
  onDeleteFixed,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  onOpenSettings,
  onReset
}) {
  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');

  // Función para formatear mientras se escribe (ej: 1000 -> 1.000)
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Solo números
    if (rawValue === '') {
      setIncomeAmount('');
      return;
    }
    const numericValue = Number(rawValue);
    setIncomeAmount(numericValue.toLocaleString('es-CL'));
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    // Limpiamos los puntos para enviar el número real a la función
    const cleanNumber = Number(incomeAmount.replace(/\./g, ''));
    if (!cleanNumber || cleanNumber <= 0) return;
    
    onAddIncome(cleanNumber, incomeDescription);
    setIncomeAmount('');
    setIncomeDescription('');
    setShowIncomeInput(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-12">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Cabecera */}
        <header className="flex items-center justify-between pt-2 pb-1">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Controla tu Sueldo</h1>
            <p className="text-xs text-slate-400">Ciclo con corte el día {cutoffDay}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title="Configurar sueldo"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-rose-400 transition-colors"
              title="Reiniciar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tarjeta Destacada principal: Total Restante con mayor énfasis */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 shadow-xl shadow-emerald-950/50 text-slate-950">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/20 px-3 py-1 rounded-full text-emerald-950">
              Total Restante Real
            </span>
            <span className="text-xs font-semibold flex items-center gap-1 text-emerald-950">
              <Wallet className="w-3.5 h-3.5" /> Sueldo base: {formatCLP(salary)}
            </span>
          </div>
          
          <div className="text-4xl font-black tracking-tight my-2">
            {formatCLP(totalRemaining)}
          </div>
          
          <p className="text-xs font-medium opacity-90 mb-4">
            Dinero libre después de descontar gastos fijos pagados y gastos diarios.
          </p>

          {/* Botón verde para Ingreso Extra justo debajo */}
          {!showIncomeInput ? (
            <button
              onClick={() => setShowIncomeInput(true)}
              className="w-full mt-1 bg-emerald-950 text-emerald-100 hover:bg-emerald-900 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Ingreso Extra
            </button>
          ) : (
            <form onSubmit={handleIncomeSubmit} className="mt-3 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-900/60 space-y-2">
              <div className="text-xs font-bold text-emerald-950 flex justify-between items-center">
                <span>Registrar Ingreso Extra</span>
                <button 
                  type="button" 
                  onClick={() => setShowIncomeInput(false)}
                  className="text-emerald-950 hover:text-white text-xs font-bold"
                >
                  ✕ Cancelar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Monto ($)"
                  value={incomeAmount}
                  onChange={handleAmountChange}
                  className="w-full bg-emerald-950/60 border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  autoFocus
                  required
                />
                <input
                  type="text"
                  placeholder="Motivo (ej. Venta, Bono)"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  className="w-full bg-emerald-950/60 border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow"
              >
                Sumar al Total Restante
              </button>
            </form>
          )}
        </div>

        {/* Tarjetas secundarias (Presupuesto diario y Gastado Total) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Disponible para hoy
            </div>
            <div className={`text-lg font-bold ${dailyBudget < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
              {formatCLP(dailyBudget)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{daysLeft} días restantes</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Gastado Total
            </div>
            <div className="text-lg font-bold text-rose-400">
              {formatCLP(totalSpent)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{expenses.length} movimientos</div>
          </div>
        </div>

        {/* Módulo de Gastos Fijos */}
        <FixedExpenses
          fixedExpenses={fixedExpenses}
          onAddFixed={onAddFixed}
          onTogglePaid={onToggleFixedPaid}
          onDeleteFixed={onDeleteFixed}
          totalFixed={totalFixed}
          isSimulatingAll={isSimulatingAll}
          setIsSimulatingAll={setIsSimulatingAll}
        />

        {/* Formulario de Gasto Rápido */}
        <ExpenseForm onAddExpense={onAddExpense} />

        {/* Historial Reciente */}
        <ExpenseHistory
          expenses={expenses}
          incomes={incomes}
          onDeleteExpense={onDeleteExpense}
          onDeleteIncome={onDeleteIncome}
        />

      </div>
    </div>
  );
}