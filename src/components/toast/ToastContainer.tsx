'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/stores/toastStore';

const DISPLAY_DURATION = 4000;

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      setTimeout(() => {
        remove(toast.id);
      }, DISPLAY_DURATION)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, remove]);

  return (
    <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`
              px-4 py-3 rounded shadow bg-white
              ${toast.type === 'success' && 'border border-green-300 text-green-600'}
              ${toast.type === 'error' && 'border border-red-300 text-red-600'}
              ${toast.type === 'info' && 'border border-gray-300 text-gray-700'}
            `}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
