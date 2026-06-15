'use client';

import Image from 'next/image';
import addGreyIcon from '@/assets/images/add-grey-icon.png';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';

function Tag() {
  const { state, actions } = usePostEditorContext();

  return (
    <>
      <div className="w-full min-h-10 flex">
        {!state.isPreview && (
          <button
            onClick={actions.addTag}
            className="w-10 h-10 hover:cursor-pointer hover:opacity-60 duration-200 flex items-center justify-center"
          >
            <Image
              src={addGreyIcon}
              alt="add grey icon"
              width={16}
              height={16}
            />
          </button>
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
              <Image
                src={addGreyIcon}
                alt="remove tag icon"
                width={15}
                height={15}
                className="absolute rotate-45 -top-1.5 -right-1.5 hover:cursor-pointer hover:opacity-60 duration-200"
                onClick={() => actions.removeTag(tag)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tag;
