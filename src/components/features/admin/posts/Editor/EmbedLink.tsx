'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import addGreyIcon from '@/assets/images/add-grey-icon.png';
import Image from 'next/image';
import useCheckMobile from '@/hooks/admin/common/useCheckMobile';

interface EmbedLinkProps {
  open: boolean;
  onClose: () => void;
}

function EmbedLink({ open, onClose }: EmbedLinkProps) {
  const { state, actions } = usePostEditorContext();
  const isMobile = useCheckMobile();

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50" onClick={onClose}>
      <Card
        className="fixed lg:absolute w-80 h-12 flex items-center justify-start border border-gray-200 shadow p-2 lg:translate-x-[10%] lg:translate-y-[-50%]"
        style={
          isMobile
            ? {
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }
            : {
                top: state.cursorPosition.y,
                left: state.cursorPosition.x,
              }
        }
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          type="url"
          placeholder="URLを入力してください"
          className="w-full shadow-none border-none"
          value={state.inputUrl}
          onChange={actions.handleInputChange}
        />
        <Button
          className="w-12 h-8 cursor-pointer mx-2"
          onClick={actions.handleInsert}
        >
          挿入
        </Button>
        <Image
          src={addGreyIcon}
          alt="追加"
          width={15}
          height={15}
          className="hover:cursor-pointer hover:opacity-60 duration-200 rotate-45 absolute -top-1 -right-1"
          onClick={onClose}
        />
      </Card>
    </div>
  );
}

export default EmbedLink;
