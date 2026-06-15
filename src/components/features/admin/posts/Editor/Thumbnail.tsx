'use client';

import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import thumbnailIcon from '@/assets/images/thumbnail-icon.png';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import addGreyIcon from '@/assets/images/add-grey-icon.png';
import { THUMBNAIL_ACCEPT_FORMATS } from '@/constants/admin/fileFormats';
import { Spinner } from '@/components/ui/spinner';
import ThumbnailConfirm from '@/components/features/admin/posts/ThumbnailConfirm';

function Thumbnail() {
  const { state, actions, ui } = usePostEditorContext();

  return (
    <CardContent className="w-full aspect-video  lg:p-4 p-2 flex items-center justify-center">
      <div className="w-full h-full rounded-lg relative">
        {!state.isThumbnailLoading && state.thumbnailUrl && (
          <>
            <Image
              src={state.thumbnailUrl}
              alt={state.altText ?? 'thumbnail'}
              unoptimized
              fill
              className="object-contain rounded-lg"
            />
            {!state.isPreview && (
              <Image
                src={addGreyIcon}
                alt="削除ボタン"
                width={24}
                height={24}
                className="absolute -top-5 -right-5 rotate-45 hover:cursor-pointer hover:opacity-60 duration-200"
                onClick={actions.handleDeleteThumbnail}
              />
            )}
          </>
        )}
        {!state.isThumbnailLoading &&
          !state.thumbnailUrl &&
          !state.isPreview && (
            <Image
              src={thumbnailIcon}
              alt="thumbnail"
              width={40}
              height={40}
              className="absolute top-1/2 left-30 -translate-y-1/2 hover:cursor-pointer hover:opacity-60 duration-200"
              onClick={actions.handleThumbnailClick}
            />
          )}
        {state.isThumbnailLoading && (
          <div className="absolute inset-0 rounded-lg flex flex-col items-center justify-center z-10">
            <Spinner />
            <span className="text-sm">
              {state.loadingType === 'delete'
                ? '削除中...'
                : 'アップロード中...'}
            </span>
          </div>
        )}
        <input
          // eslint-disable-next-line react-hooks/refs
          ref={ui.thumbnailInputRef}
          type="file"
          className="hidden"
          accept={THUMBNAIL_ACCEPT_FORMATS}
          onChange={actions.handleFileChange}
          disabled={state.isThumbnailLoading}
        />
      </div>
      <ThumbnailConfirm
        open={state.isAlertOpen}
        onOpenChange={actions.handleAlertOpenChange}
        onConfirm={actions.handleConfirmUpload}
        onCancel={actions.handleCancelUpload}
        previewImageUrl={state.previewImageUrl}
      />
    </CardContent>
  );
}

export default Thumbnail;
