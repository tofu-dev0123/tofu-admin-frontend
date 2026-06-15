import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  errorMessage: string[];
  onClose?: () => void;
}

function ErrorModal({
  isOpen,
  title = 'エラー',
  errorMessage,
  onClose,
}: ErrorModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`${isOpen ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-full flex justify-center items-center`}
    >
      <Alert
        variant="destructive"
        className="w-1/2 bg-white rounded-md p-4 shadow-md"
      >
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="w-6 h-6" />
          <AlertTitle className="text-lg font-bold m-0">{title}</AlertTitle>
        </div>
        <AlertDescription className="px-4">
          <ul className="list-inside list-disc text-base">
            {errorMessage.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </AlertDescription>
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleClose}
          >
            閉じる
          </Button>
        </div>
      </Alert>
    </div>
  );
}

export default ErrorModal;
