import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastNotificationProps {
  actionName: string;
  kgSaved: number;
  onDismiss: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ actionName, kgSaved, onDismiss }) => {
  return (
    <div 
      className="pointer-events-auto bg-primary text-on-primary p-4 rounded-xl shadow-2xl flex items-center justify-between border border-white/10 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] gap-4"
      id="toast-notification"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/15 p-2 rounded-full border border-white/5 flex items-center justify-center text-on-primary">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="font-headline text-xs font-bold uppercase tracking-wider opacity-90">Logged: {actionName}</p>
          <p className="font-sans text-xs font-extrabold text-on-primary mt-0.5">
            +{kgSaved.toFixed(1)}kg CO₂ saved today! 🌱
          </p>
        </div>
      </div>
      <button 
        onClick={onDismiss} 
        className="p-1 rounded-full hover:bg-white/10 text-on-primary/70 hover:text-on-primary transition-all duration-100 cursor-pointer"
        title="Close Toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastNotification;
