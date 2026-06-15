import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onCancel?: () => void;
  onAction?: () => void;
  previewImageUrl?: string | null;
}

function Alert({
  open,
  onOpenChange,
  title = '警告',
  description = '',
  cancelText = 'キャンセル',
  actionText = '続ける',
  onCancel,
  onAction,
  previewImageUrl,
}: AlertProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="lg:max-w-2xl w-11/12 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {previewImageUrl && (
            <div className="mt-4 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-video rounded-lg overflow-hidden">
                <Image
                  src={previewImageUrl}
                  alt="プレビュー画像"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
