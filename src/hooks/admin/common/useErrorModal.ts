import { useState, useCallback } from 'react';

export default function useErrorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('エラー');
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setTitle('エラー');
    setErrorMessage([]);
  }, []);

  const showError = useCallback((message: string[]) => {
    setErrorMessage(message);
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    title,
    errorMessage,
    setErrorMessage,
    setIsOpen,
    showError,
    onClose,
  };
}
