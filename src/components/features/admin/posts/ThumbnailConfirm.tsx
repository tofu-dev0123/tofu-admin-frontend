'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import CropMask from './CropMask';

interface ThumbnailConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewImageUrl: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}
function ThumbnailConfirm({
  open,
  onOpenChange,
  previewImageUrl,
  onConfirm,
  onCancel,
}: ThumbnailConfirmProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="lg:max-w-2xl w-11/12 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>サムネイルをアップロードします</AlertDialogTitle>
        </AlertDialogHeader>
        {previewImageUrl && (
          <div className="w-full relative">
            <Image
              src={previewImageUrl}
              alt="プレビュー画像"
              width={1}
              height={1}
              className="w-full h-auto object-cover"
              unoptimized
            />
            <CropMask />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            アップロード
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ThumbnailConfirm;
