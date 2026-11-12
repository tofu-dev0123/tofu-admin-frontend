'use client';

import AboutMain from '@/components/features/admin/about/AboutMain';
import AboutMainSkeleton from '@/components/features/admin/about/AboutMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useProfileQuery from '@/hooks/admin/about/useProfileQuery';
import useTimelinesQuery from '@/hooks/admin/about/useTimelinesQuery';

function AboutSection() {
  const profileQuery = useProfileQuery();
  const timelinesQuery = useTimelinesQuery();

  const profile = profileQuery.data;
  const timelines = timelinesQuery.data;

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!profile || !timelines) {
    const isError =
      (profileQuery.isError && !profile) ||
      (timelinesQuery.isError && !timelines);
    return isError ? <SectionError className="m-4" /> : <AboutMainSkeleton />;
  }

  return <AboutMain initialProfile={profile} timelines={timelines.timelines} />;
}

export default AboutSection;
