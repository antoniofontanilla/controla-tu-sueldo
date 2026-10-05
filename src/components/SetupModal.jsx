import { useState } from 'react';
import { Settings, DollarSign, Calendar } from 'lucide-react';
import { parseCLPInput, rawNumber } from '../utils/formatters';

export default function SetupModal({ initialSalary, initialCutoff, onSave }) {
  const [salary, setSalary] = useState(initialSalary ? parseCLPInput(initialSalary.toString()) : '');
  const [cutoffDay, setCutoffDay] = useState(initialCutoff || 30);

  const handleSalaryChange = (e) => {
    const formatted = parseCLPInput(e.target.value);
    setSalary(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericSalary = rawNumber(salary);
    if (!numericSalary || numericSalary <= 0) return;
    onSave(numericSalary, Number(cutoffDay));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Configura tu Ciclo</h2>
            <p className="text-xs text-slate-400">Ingresa tu sueldo y día de corte</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Sueldo Total / Presupuesto Mensual ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="Ej: 750.000"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Día de corte mensual (1 al 31)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="number"
                min="1"
                max="31"
                value={cutoffDay}
                onChange={(e) => setCutoffDay(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 mt-2"
          >
            Guardar y Comenzar
          </button>
        </form>
      </div>
    </div>
  );
}