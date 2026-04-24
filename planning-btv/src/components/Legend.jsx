import { CalendarCheck, Clapperboard, CircleHelp, ListTodo } from 'lucide-react';

const ITEMS = [
  {
    Icon: () => <CalendarCheck size={14} strokeWidth={2} className="text-green-800" />,
    label: 'Dates fixes',
  },
  {
    Icon: () => <Clapperboard size={14} strokeWidth={2} className="text-red-700" />,
    label: 'Tournage',
  },
  {
    Icon: () => <CircleHelp size={14} strokeWidth={2} className="text-orange-500" />,
    label: 'Événement incertain',
  },
  {
    Icon: () => <ListTodo size={14} strokeWidth={2} className="text-green-800" />,
    label: 'Tâche interne',
  },
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-5 justify-center mt-4 max-w-screen-xl mx-auto">
      {ITEMS.map(({ Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
          <Icon />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
