import { useState, useEffect } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import {
  dateStrToMonthPos,
  monthPosToDateStr,
  dateStrsToMonthPosDur,
  monthPosDurToEndDateStr,
  getSeasonBounds,
} from '../utils/dates';
import { usePlanning } from '../contexts/PlanningContext';

export function EventModal({ event, type, onSave, onDelete, onClose }) {
  const { config } = usePlanning();
  const { min: SEASON_MIN, max: SEASON_MAX } = getSeasonBounds(config);

  const [text, setText]           = useState('');
  const [startDate, setStartDate] = useState(SEASON_MIN);
  const [endDate, setEndDate]     = useState('');

  const showRange = ['task', 'uncertain'].includes(type);

  useEffect(() => {
    if (event) {
      setText(event.text || '');
      const start = monthPosToDateStr(event.month, event.pos, config);
      setStartDate(start);
      if (showRange) setEndDate(monthPosDurToEndDateStr(event.month, event.pos, event.dur || 0.3, config));
    } else {
      setText('');
      setStartDate(SEASON_MIN);
      setEndDate(SEASON_MIN);
    }
  }, [event, type]);

  const handleStartChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (showRange && endDate <= val) {
      const d = new Date(val + 'T12:00:00');
      d.setDate(d.getDate() + 7);
      const next = d.toISOString().split('T')[0];
      setEndDate(next > SEASON_MAX ? SEASON_MAX : next);
    }
  };

  const handleSave = () => {
    if (!text.trim()) { alert('Le texte ne peut pas être vide'); return; }
    let formData;
    if (showRange) formData = { text: text.trim(), ...dateStrsToMonthPosDur(startDate, endDate, config) };
    else formData = { text: text.trim(), ...dateStrToMonthPos(startDate, config) };
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[998] flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl z-[999] w-[min(400px,92vw)] animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">
            {event ? 'Modifier' : 'Ajouter'}{' '}
            <span className="text-gray-500 font-medium">{getTypeLabel(type)}</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-3">
          <Field label="Texte">
            <input type="text" value={text} onChange={e => setText(e.target.value)} autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700 transition-colors" />
          </Field>

          <Field label={showRange ? 'Date de début' : 'Date'}>
            <input type="date" value={startDate} min={SEASON_MIN} max={SEASON_MAX} onChange={handleStartChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700 transition-colors" />
          </Field>

          {showRange && (
            <Field label="Date de fin">
              <input type="date" value={endDate} min={startDate} max={SEASON_MAX} onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700 transition-colors" />
            </Field>
          )}

          <div className="flex gap-2 pt-1">
            {event && (
              <button type="button" onClick={() => onDelete(event.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-100 active:scale-95 transition-all duration-150 cursor-pointer border-0">
                <Trash2 size={14} strokeWidth={2.5} />Supprimer
              </button>
            )}
            <button type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-800 text-white text-sm font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer border-0">
              <Check size={14} strokeWidth={2.5} />
              {event ? 'Enregistrer' : 'Ajouter'}
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

function getTypeLabel(type) {
  return { fixed: 'Date fixe', tournage: 'Tournage', uncertain: 'Événement incertain', task: 'Tâche interne' }[type] || type;
}
