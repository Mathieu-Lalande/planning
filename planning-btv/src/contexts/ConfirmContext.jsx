import { createContext, useContext, useState, useCallback } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback(({ title, message, confirmLabel = 'Confirmer', danger = false }) => {
    return new Promise((resolve) => {
      setState({ title, message, confirmLabel, danger, resolve });
    });
  }, []);

  const handleConfirm = () => { state?.resolve(true);  setState(null); };
  const handleCancel  = () => { state?.resolve(false); setState(null); };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-2xl w-[min(360px,92vw)] animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              {state.danger && (
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={18} strokeWidth={2} className="text-red-600" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">{state.title}</h3>
                {state.message && (
                  <p className="text-sm text-gray-500 mt-1">{state.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer bg-white"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all duration-150 cursor-pointer border-0 ${
                  state.danger ? 'bg-red-600 hover:bg-red-500' : 'bg-green-800 hover:bg-green-700'
                }`}
              >
                {state.danger && <Trash2 size={13} strokeWidth={2.5} />}
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
