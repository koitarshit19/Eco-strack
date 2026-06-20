import { useStore } from '../store/useStore';
import ToastNotification from './ToastNotification';

export default function Toaster() {
  const { toasts, removeToast } = useStore();

  return (
    <div 
      className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-40px)] max-w-sm pointer-events-none flex flex-col gap-2"
      id="toast-container"
    >
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          actionName={toast.actionName}
          kgSaved={toast.kgSaved}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
