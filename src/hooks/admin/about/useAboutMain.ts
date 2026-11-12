'use client';

import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useProfileForm from '@/hooks/admin/about/useProfileForm';
import useTimelines from '@/hooks/admin/about/useTimelines';
import { ProfileResponse, Timeline } from '@/types/api/about';

interface UseAboutMainProps {
  initialProfile: ProfileResponse;
  initialTimelines: Timeline[];
}

function useAboutMain({ initialProfile, initialTimelines }: UseAboutMainProps) {
  const errorModalHooks = useErrorModal();
  const profileHooks = useProfileForm({
    initial: initialProfile,
    showError: errorModalHooks.showError,
  });
  const timelinesHooks = useTimelines({
    initial: initialTimelines,
    showError: errorModalHooks.showError,
  });

  return {
    profileHooks,
    timelinesHooks,
    errorModalHooks,
  };
}

export default useAboutMain;
