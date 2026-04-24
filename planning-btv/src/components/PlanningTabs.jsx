import { useState, useRef, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { usePlanning } from '../contexts/PlanningContext';
import { useConfirm } from '../contexts/ConfirmContext';

export function PlanningTabs() {
  const { plannings, activePlanningId, setActivePlanning, createPlanning, deletePlanning } = usePlanning();
  const { confirm } = useConfirm();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleCreate = () => {
    const name = newName.trim();
    if (name) createPlanning({ name });
    setNewName('');
    setCreating(false);
  };

  const handleCancel = () => {
    setNewName('');
    setCreating(false);
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    const ok = await confirm({
      title: `Supprimer "${name}" ?`,
      message: 'Tous les événements de ce planning seront perdus.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (ok) deletePlanning(id);
  };

  if (plannings.length === 1 && !creating) {
    return (
      <div className="flex items-center max-w-screen-xl mx-auto mb-4">
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-0 bg-transparent"
        >
          <Plus size={12} strokeWidth={2.5} />
          Nouveau planning
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 max-w-screen-xl mx-auto mb-4 flex-wrap">
      {plannings.map(p => {
        const isActive = p.id === activePlanningId;
        return (
          <div key={p.id} className="group relative">
            <button
              onClick={() => setActivePlanning(p.id)}
              className={`pl-3.5 pr-3.5 py-1.5 rounded-xl text-sm transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-white text-gray-900 font-semibold border-gray-200 shadow-sm pr-7'
                  : 'bg-white/50 text-gray-500 font-medium border-transparent hover:bg-white/80 hover:text-gray-700'
              }`}
            >
              <span className="block max-w-[180px] truncate">{p.name}</span>
            </button>
            {plannings.length > 1 && (
              <button
                onClick={(e) => handleDelete(e, p.id, p.name)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded cursor-pointer border-0 bg-transparent"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}

      {creating ? (
        <form
          onSubmit={e => { e.preventDefault(); handleCreate(); }}
          className="flex items-center gap-1"
        >
          <input
            ref={inputRef}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && handleCancel()}
            placeholder="Nom du planning…"
            className="px-3 py-1.5 text-sm border border-green-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700/20 w-44 bg-white"
          />
          <button
            type="submit"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-800 text-white hover:bg-green-700 border-0 cursor-pointer transition-colors"
          >
            <Check size={12} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-0 cursor-pointer bg-transparent transition-colors"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all duration-150 cursor-pointer border-0 bg-transparent"
          title="Nouveau planning"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
