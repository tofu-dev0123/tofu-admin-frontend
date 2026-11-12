'use client';

import useAboutMain from '@/hooks/admin/about/useAboutMain';
import ProfileCard from '@/components/features/admin/about/ProfileCard';
import TimelineSection from '@/components/features/admin/about/TimelineSection';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import Alert from '@/components/features/admin/common/Alert';
import { ProfileResponse, Timeline } from '@/types/api/about';
import { MESSAGES } from '@/constants/messages';

interface AboutMainProps {
  initialProfile: ProfileResponse;
  initialTimelines: Timeline[];
}

function AboutMain({ initialProfile, initialTimelines }: AboutMainProps) {
  const { profileHooks, timelinesHooks, errorModalHooks } = useAboutMain({
    initialProfile,
    initialTimelines,
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          About 設定
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          公開サイトの About（自己紹介）ページに表示される情報を編集します。
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileCard profileHooks={profileHooks} />
        <TimelineSection timelinesHooks={timelinesHooks} />
      </div>

      <ErrorModal
        isOpen={errorModalHooks.isOpen}
        errorMessage={errorModalHooks.errorMessage}
        onClose={errorModalHooks.onClose}
      />
      <Alert
        open={timelinesHooks.deleteTarget !== null}
        onOpenChange={(next) => {
          if (!next) timelinesHooks.closeDelete();
        }}
        title={MESSAGES.confirm.deleteTimeline.title}
        description={MESSAGES.confirm.deleteTimeline.description}
        actionText="削除"
        onAction={timelinesHooks.confirmDelete}
      />
    </div>
  );
}

export default AboutMain;
