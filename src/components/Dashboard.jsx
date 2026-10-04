import { Wallet, Calendar, TrendingDown, RefreshCw, Settings } from 'lucide-react';
import { formatCLP } from '../utils/formatters';
import ExpenseForm from './ExpenseForm';
import ExpenseHistory from './ExpenseHistory';
import FixedExpenses from './FixedExpenses';

export default function Dashboard({
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
  onAddFixed,
  onToggleFixedPaid,
  onDeleteFixed,
  onAddExpense,
  onDeleteExpense,
  onOpenSettings,
  onReset
}) {
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
          <p className="text-xs font-medium opacity-90">
            Dinero libre después de descontar gastos fijos pagados y gastos diarios.
          </p>
        </div>

        {/* Tarjetas secundarias (Presupuesto diario y Gastado Total) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Disponible para hoy
            </div>
            <div className="text-lg font-bold text-white">
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
        <ExpenseHistory expenses={expenses} onDeleteExpense={onDeleteExpense} />

      </div>
    </div>
  );
}