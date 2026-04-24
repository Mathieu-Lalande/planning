import { Camera, Settings } from 'lucide-react';
import { usePlanning } from '../contexts/PlanningContext';

export function Header({ onCapture, onSettings }) {
  const { config } = usePlanning();

  return (
    <div className="flex items-center justify-between max-w-screen-xl mx-auto mb-4">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Bourges Télévision" className="w-10 h-10 rounded-full flex-shrink-0" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Bourges Télévision</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{config.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSettings}
          className="flex items-center gap-2 px-3 py-2.5 bg-white text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-150 cursor-pointer border border-gray-200 shadow-sm"
        >
          <Settings size={15} strokeWidth={2} />
          Paramètres
        </button>
        <button
          onClick={onCapture}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 active:scale-95 transition-all duration-150 cursor-pointer border-0 shadow-sm"
        >
          <Camera size={15} strokeWidth={2.5} />
          Capturer
        </button>
      </div>
    </div>
  );
}
