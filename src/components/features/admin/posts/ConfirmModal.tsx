import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import confirmIcon from '@/assets/images/confirm-icon.png';
import Image from 'next/image';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import { PostStatus } from '@/types/api/post';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tags: string[];
}

function ConfirmModal({ isOpen, onClose, title, tags }: ConfirmModalProps) {
  const { actions, state } = usePostEditorContext();
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="bg-black/20 fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <Card className="lg:w-150 w-11/12 border-gray-200 shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <CardHeader>
          <Image src={confirmIcon} alt="confirm" width={24} height={24} />
        </CardHeader>
        <CardContent className="w-full flex flex-col items-start justify-start gap-6">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <Label className="w-full text-sm border-b border-gray-200 pb-4 py-2">
              タイトル
            </Label>
            <p className="text-lg font-bold">{title}</p>
          </div>
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <Label className="w-full text-sm border-b border-gray-200 pb-4 py-2">
              タグ
            </Label>
            <div className="w-full flex items-center justify-start gap-2 flex-wrap">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center justify-start gap-2 border border-gray-200 rounded-md px-4"
                >
                  <p className="text-sm">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full flex items-center justify-end gap-4">
          <Button
            variant="outline"
            className="w-30 rounded-full cursor-pointer shadow-none"
            onClick={handleClose}
          >
            戻る
          </Button>
          <Button
            className="w-30 rounded-full bg-admin-main text-white cursor-pointer shadow-none hover:bg-admin-main/90 hover:text-white"
            onClick={() =>
              actions.handleSubmit(state, 'PUBLISHED' as PostStatus)
            }
          >
            公開
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ConfirmModal;
