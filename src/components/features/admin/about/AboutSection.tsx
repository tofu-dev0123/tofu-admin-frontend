'use client';

import AboutMain from '@/components/features/admin/about/AboutMain';
import AboutMainSkeleton from '@/components/features/admin/about/AboutMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useProfileQuery from '@/hooks/admin/about/useProfileQuery';
import useTimelinesQuery from '@/hooks/admin/about/useTimelinesQuery';

function AboutSection() {
  const profileQuery = useProfileQuery();
  const timelinesQuery = useTimelinesQuery();

  if (profileQuery.isPending || timelinesQuery.isPending) {
    return <AboutMainSkeleton />;
  }
  if (profileQuery.isError || timelinesQuery.isError) {
    return <SectionError className="m-4" />;
  }

  return (
    <AboutMain
      initialProfile={profileQuery.data}
      timelines={timelinesQuery.data.timelines}
    />
  );
}

export default AboutSection;
