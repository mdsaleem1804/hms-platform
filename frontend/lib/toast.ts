import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'warning';

interface ToastConfig {
  id?: string;
  duration?: number;
}

const buildToastId = (type: ToastType, message: string, id?: string) => {
  if (id) return id;
  const normalized = message.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
  return `${type}:${normalized}`;
};

const showToast = (type: ToastType, message: string, config: ToastConfig = {}) => {
  if (!message?.trim()) return;

  const toastId = buildToastId(type, message, config.id);
  const duration =
    config.duration ?? (type === 'success' ? 3500 : type === 'warning' ? 4500 : 5000);

  if (type === 'success') {
    toast.success(message, { id: toastId, duration });
    return;
  }

  if (type === 'warning') {
    toast(message, {
      id: toastId,
      duration,
      icon: '!',
    });
    return;
  }

  toast.error(message, { id: toastId, duration });
};

export const notify = {
  success: (message: string, config?: ToastConfig) => showToast('success', message, config),
  error: (message: string, config?: ToastConfig) => showToast('error', message, config),
  warning: (message: string, config?: ToastConfig) => showToast('warning', message, config),
};
