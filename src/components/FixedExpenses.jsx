import { useState } from 'react';
import { ShieldCheck, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Eye } from 'lucide-react';
import { formatCLP, parseCLPInput, rawNumber } from '../utils/formatters';

export default function FixedExpenses({ 
  fixedExpenses, 
  onAddFixed, 
  onTogglePaid, 
  onDeleteFixed, 
  totalFixed, 
  isSimulatingAll, 
  setIsSimulatingAll 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');

  const handleAmountChange = (e) => {
    setDisplayAmount(parseCLPInput(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = rawNumber(displayAmount);
    if (!title || numericAmount <= 0) return;
    onAddFixed(title, numericAmount);
    setTitle('');
    setDisplayAmount('');
  };

  const totalPaidAmount = fixedExpenses.filter(i => i.paid).reduce((acc, i) => acc + Number(i.amount), 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Gastos Fijos Mensuales</h3>
            <p className="text-xs font-bold text-indigo-400">
              Total: {formatCLP(totalFixed)} {totalPaidAmount > 0 && <span className="text-emerald-400 font-normal">({formatCLP(totalPaidAmount)} pagados)</span>}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Arriendo, Luz..."
              className="flex-1 min-w-[110px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="Monto ($)"
              className="w-28 sm:flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl transition-colors flex items-center justify-center text-xs shadow-lg shadow-indigo-950 shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {fixedExpenses.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-2">No hay gastos fijos registrados todavía.</p>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  type="button"
                  onMouseDown={() => setIsSimulatingAll(true)}
                  onMouseUp={() => setIsSimulatingAll(false)}
                  onMouseLeave={() => setIsSimulatingAll(false)}
                  onTouchStart={() => setIsSimulatingAll(true)}
                  onTouchEnd={() => setIsSimulatingAll(false)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all select-none ${
                    isSimulatingAll 
                      ? 'bg-emerald-600 text-slate-950 border-emerald-500 font-bold shadow-lg shadow-emerald-900/50' 
                      : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isSimulatingAll ? "¡ Simulando todos pagados !" : "Mantén presionado para simular pago total"}
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {fixedExpenses.map((item) => {
                  const isEffectivePaid = item.paid || isSimulatingAll;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-colors ${
                        isEffectivePaid 
                          ? 'bg-emerald-950/20 border-emerald-900/40' 
                          : 'bg-slate-800/40 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onTogglePaid(item.id)}
                          className={`transition-colors ${item.paid ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                          title={item.paid ? "Marcado como pagado" : "Marcar como pagado"}
                        >
                          {item.paid ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <span className={`text-xs font-medium ${isEffectivePaid ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${isEffectivePaid ? 'text-emerald-400/80' : 'text-indigo-300'}`}>
                          - {formatCLP(item.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteFixed(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                          title="Eliminar gasto fijo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}