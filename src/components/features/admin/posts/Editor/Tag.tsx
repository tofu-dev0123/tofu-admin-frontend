'use client';

import Image from 'next/image';
import addGreyIcon from '@/assets/images/add-grey-icon.png';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import { Button } from '@/components/ui/button';

function Tag() {
  const { state, actions } = usePostEditorContext();

  return (
    <>
      <div className="w-full min-h-10 flex">
        {!state.isPreview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="タグを追加"
            onClick={actions.addTag}
            className="h-10 w-10"
          >
            <Image src={addGreyIcon} alt="" width={16} height={16} />
          </Button>
        )}
        <input
          type="text"
          placeholder={state.isPreview ? '' : 'タグの追加'}
          size={50}
          className="w-full border-none focus:outline-none focus:ring-0 text-sm font-bold placeholder:text-gray-400 resize-none"
          value={state.inputValue}
          readOnly={state.isPreview}
          onChange={(e) => actions.setInputValue(e.target.value)}
        />
      </div>
      <div className="w-full flex items-center justify-start flex-wrap gap-4 my-2">
        {state.tags.map((tag) => (
          <div
            key={tag}
            className="px-4 py-0 rounded-md border border-gray-200 relative"
          >
            <span className="text-sm font-bold">{tag}</span>
            {!state.isPreview && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`タグ「${tag}」を削除`}
                onClick={() => actions.removeTag(tag)}
                className="absolute -top-2.5 -right-2.5 rounded-full"
              >
                <Image
                  src={addGreyIcon}
                  alt=""
                  width={15}
                  height={15}
                  className="rotate-45"
                />
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tag;
