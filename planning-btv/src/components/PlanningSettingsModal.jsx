import { useState } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { usePlanning } from '../contexts/PlanningContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { MONTH_NAMES_FULL } from '../utils/dates';

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

function configToEndDate(config) {
  const total = config.startYear * 12 + config.startMonth + config.monthCount - 1;
  return { endYear: Math.floor(total / 12), endMonth: total % 12 };
}

function computeMonthCount(startYear, startMonth, endYear, endMonth) {
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

export function PlanningSettingsModal({ onClose }) {
  const { config, plannings, activePlanningId, updateActivePlanning, deletePlanning } = usePlanning();
  const { confirm } = useConfirm();

  const { endYear: initEY, endMonth: initEM } = configToEndDate(config);
  const [name, setName]             = useState(config.name);
  const [startMonth, setStartMonth] = useState(config.startMonth);
  const [startYear, setStartYear]   = useState(config.startYear);
  const [endMonth, setEndMonth]     = useState(initEM);
  const [endYear, setEndYear]       = useState(initEY);

  const monthCount = computeMonthCount(startYear, startMonth, endYear, endMonth);
  const isValid = monthCount >= 1;

  const handleSave = () => {
    if (!isValid) return;
    updateActivePlanning({ name: name.trim() || config.name, startYear, startMonth, monthCount });
    onClose();
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: `Supprimer "${config.name}" ?`,
      message: 'Tous les événements de ce planning seront perdus.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (ok) { deletePlanning(activePlanningId); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[998] flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl z-[999] w-[min(440px,94vw)] animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">Paramètres du planning</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-3">
          <Field label="Nom">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700 transition-colors"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Début">
              <div className="flex gap-1.5">
                <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-green-700">
                  {MONTH_NAMES_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}
                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-green-700">
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Fin">
              <div className="flex gap-1.5">
                <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-green-700">
                  {MONTH_NAMES_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select value={endYear} onChange={e => setEndYear(Number(e.target.value))}
                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-green-700">
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </Field>
          </div>

          {!isValid && (
            <p className="text-xs text-red-600">La date de fin doit être après la date de début.</p>
          )}

          <div className="flex gap-2 pt-1">
            {plannings.length > 1 && (
              <button type="button" onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-100 active:scale-95 transition-all duration-150 cursor-pointer border-0">
                <Trash2 size={14} strokeWidth={2.5} />Supprimer
              </button>
            )}
            <button type="submit" disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-800 text-white text-sm font-semibold rounded-xl hover:bg-green-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer border-0">
              <Check size={14} strokeWidth={2.5} />Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}
