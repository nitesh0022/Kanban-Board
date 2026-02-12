import { useKanban } from '../context/KanbanContext';

export default function Toast() {
  const { toasts } = useKanban();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
