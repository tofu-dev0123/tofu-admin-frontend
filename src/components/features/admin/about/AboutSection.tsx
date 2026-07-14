import AboutMain from '@/components/features/admin/about/AboutMain';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverFetch } from '@/lib/api/server';
import type {
  ProfileResponse,
  Timeline,
  TimelineListResponse,
} from '@/types/api/about';

async function AboutSection() {
  let profile: ProfileResponse;
  let timelines: Timeline[];
  try {
    const [profileRes, timelineRes] = await Promise.all([
      serverFetch<ProfileResponse>('/admin/profile', {
        label: 'プロフィール取得',
      }),
      serverFetch<TimelineListResponse>('/admin/timelines', {
        label: '年表一覧取得',
      }),
    ]);
    profile = profileRes;
    timelines = timelineRes.timelines;
  } catch {
    return <SectionError className="m-4" />;
  }

  return <AboutMain initialProfile={profile} initialTimelines={timelines} />;
}

export default AboutSection;
