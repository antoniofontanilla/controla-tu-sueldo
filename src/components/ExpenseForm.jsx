import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { parseCLPInput, rawNumber } from '../utils/formatters';

export default function ExpenseForm({ onAddExpense }) {
  const [displayAmount, setDisplayAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAmountChange = (e) => {
    const formatted = parseCLPInput(e.target.value);
    setDisplayAmount(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = rawNumber(displayAmount);
    if (numericAmount <= 0) return;

    onAddExpense(numericAmount, description);
    setDisplayAmount('');
    setDescription('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
        <PlusCircle className="w-4 h-4 text-emerald-400" />
        Registrar Gasto Rápido
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Casilla de monto con un tamaño equilibrado y texto mediano */}
        <div className="w-[38%] relative">
          <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={displayAmount}
            onChange={handleAmountChange}
            placeholder="Monto"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
          />
        </div>

        {/* Casilla de descripción más compacta */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿En qué gastaste?"
          className="w-[42%] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />

        {/* Botón */}
        <button
          type="submit"
          className="w-[20%] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl transition-colors text-xs shadow-lg shadow-emerald-950 whitespace-nowrap flex items-center justify-center"
        >
          Gastar
        </button>
      </form>
    </div>
  );
}