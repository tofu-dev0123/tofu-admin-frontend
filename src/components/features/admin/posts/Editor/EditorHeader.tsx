'use client';

import { CardContent } from '@/components/ui/card';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import previewIcon from '@/assets/images/preview-icon.png';
import editIcon from '@/assets/images/edit-icon.png';
import imageAddIcon from '@/assets/images/image-add-icon.png';
import linkIcon from '@/assets/images/link-icon.png';
import uploadIcon from '@/assets/images/upload-icon.png';
import draftIcon from '@/assets/images/draft-icon.png';
import Image from 'next/image';
import { IMAGE_ACCEPT_FORMATS } from '@/constants/admin/fileFormats';
import EmbedLink from '@/components/features/admin/posts/Editor/EmbedLink';
import { PostStatus } from '@/types/api/post';

function EditorHeader() {
  const { state, actions, ui } = usePostEditorContext();

  return (
    <>
      <CardContent className="w-full h-20 lg:p-4 p-2 flex items-center justify-between gap-4 border-b border-gray-200">
        <div className="flex items-center justify-start lg:pl-10 pl-2 gap-2">
          <div
            className="relative w-18 h-8 rounded-full bg-gray-300 flex items-center justify-between mr-4"
            onClick={actions.togglePreview}
          >
            <div
              className={`absolute w-9 h-9 border border-gray-300 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                state.isPreview
                  ? 'translate-x-[calc(100%+0.1rem)]'
                  : 'translate-x-[-0.1rem]'
              }`}
            />
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center z-10">
              <Image
                src={editIcon}
                alt="edit"
                width={18}
                height={18}
                className={`${
                  state.isPreview
                    ? 'opacity-40'
                    : 'hover:cursor-pointer hover:opacity-60 duration-200'
                }`}
              />
            </div>
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center z-10">
              <Image
                src={previewIcon}
                alt="preview"
                width={18}
                height={18}
                className={`${
                  state.isPreview
                    ? 'hover:cursor-pointer hover:opacity-60 duration-200'
                    : 'opacity-40'
                }`}
              />
            </div>
          </div>
          <div className="w-10 h-full rounded-full flex items-center justify-center">
            <button
              type="button"
              className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:cursor-pointer hover:opacity-60 duration-200"
              onClick={actions.handleImageIconClick}
            >
              <Image
                src={imageAddIcon}
                alt="image add"
                width={18}
                height={18}
              />
            </button>
            <input
              type="file"
              accept={IMAGE_ACCEPT_FORMATS}
              // eslint-disable-next-line react-hooks/refs
              ref={ui.imageInputRef}
              onChange={actions.handleImageFileChange}
              className="hidden"
            />
          </div>
          <div className="w-10 h-full rounded-full flex items-center justify-center">
            <button
              className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:cursor-pointer hover:opacity-60 duration-200"
              onClick={actions.handleOpenEmbedLink}
            >
              <Image src={linkIcon} alt="link" width={18} height={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 lg:pr-10 pr-2">
          <div className="w-10 h-full rounded-full flex items-center justify-center">
            <button
              className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:cursor-pointer hover:opacity-60 duration-200"
              onClick={() => actions.handleSubmit(state, 'DRAFT' as PostStatus)}
            >
              <Image src={draftIcon} alt="draft" width={18} height={18} />
            </button>
          </div>
          <div className="w-10 h-full rounded-full flex items-center justify-center">
            <button
              className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:cursor-pointer hover:opacity-60 duration-200"
              onClick={() =>
                actions.handleOpenConfirmModal(
                  state.thumbnailUrl ?? '',
                  state.title,
                  state.tags,
                  state.content
                )
              }
            >
              <Image src={uploadIcon} alt="upload" width={18} height={18} />
            </button>
          </div>
        </div>
      </CardContent>
      <EmbedLink
        open={state.isEmbedLinkOpen}
        onClose={actions.handleCloseEmbedLink}
      />
    </>
  );
}

export default EditorHeader;
