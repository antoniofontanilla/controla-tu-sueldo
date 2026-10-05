import { Trash2, History } from 'lucide-react';
import { formatCLP } from '../utils/formatters';

export default function ExpenseHistory({ expenses = [], incomes = [], onDeleteExpense, onDeleteIncome }) {
  // Combinamos gastos e ingresos identificando su tipo
  const allMovements = [
    ...expenses.map(item => ({ ...item, type: 'expense' })),
    ...incomes.map(item => ({ ...item, type: 'income' }))
  ].sort((a, b) => b.timestamp - a.timestamp); // Ordenar del más reciente al más antiguo

  if (allMovements.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
        <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
        Aún no hay movimientos registrados en este ciclo.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-400" />
          Movimientos Recientes
        </h3>
        <span className="text-xs text-slate-500">{allMovements.length} movimientos</span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {allMovements.map((item) => {
          const isIncome = item.type === 'income';
          return (
            <div
              key={item.id}
              className="flex items-center justify-between bg-slate-800/60 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.description}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isIncome ? '+ ' : '- '}{formatCLP(item.amount)}
                </span>
                <button
                  onClick={() => isIncome ? onDeleteIncome(item.id) : onDeleteExpense(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title={isIncome ? "Eliminar ingreso" : "Eliminar gasto"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}