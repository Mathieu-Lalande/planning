import { CalendarCheck, Clapperboard, CircleHelp, ListTodo, Plus } from 'lucide-react';

const BUTTONS = [
  { type: 'fixed',     label: 'Date fixe',           Icon: CalendarCheck, className: 'bg-green-800 hover:bg-green-700 text-white' },
  { type: 'tournage',  label: 'Tournage',             Icon: Clapperboard,  className: 'bg-red-700 hover:bg-red-600 text-white' },
  { type: 'uncertain', label: 'Événement incertain',  Icon: CircleHelp,    className: 'bg-orange-500 hover:bg-orange-400 text-white' },
  { type: 'task',      label: 'Tâche interne',        Icon: ListTodo,      className: 'bg-gray-200 hover:bg-gray-300 text-gray-700' },
];

export function Controls({ onAddClick }) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center mt-5 max-w-screen-xl mx-auto">
      {BUTTONS.map(({ type, label, Icon, className }) => (
        <button
          key={type}
          onClick={() => onAddClick(type)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl active:scale-95 transition-all duration-150 border-0 cursor-pointer shadow-sm ${className}`}
        >
          <Plus size={14} strokeWidth={2.5} />
          <Icon size={14} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  );
}
