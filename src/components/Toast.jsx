import { useEffect, useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-50/90 border-green-500/50 text-green-700',
    error: 'bg-red-50/90 border-red-500/50 text-red-700',
    warning: 'bg-orange-50/90 border-orange-500/50 text-orange-700',
    neutral: 'bg-gray-50/90 border-gray-300/50 text-gray-700',
  };

  const icons = {
    success: <Check size={16} />,
    error: <X size={16} />,
    warning: <AlertTriangle size={16} />,
    neutral: <Check size={16} />,
  };

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-lg ${styles[type]} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
