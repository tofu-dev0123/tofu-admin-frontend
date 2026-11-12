'use client';

import { useCallback, useState } from 'react';
import { put } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  ProfileResponse,
  ProfilePutRequest,
  ProfilePutResponse,
} from '@/types/api/about';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseProfileFormProps {
  initial: ProfileResponse;
  showError: (message: string[]) => void;
}

/**
 * プロフィール（シングルトン）の編集フォーム。
 * 初期値はクエリ（useProfileQuery）で取得したものを props で受け取り、保存は PUT /admin/profile。
 */
function useProfileForm({ initial, showError }: UseProfileFormProps) {
  const [headline, setHeadline] = useState(initial.headline);
  const [bio, setBio] = useState(initial.bio);
  const [siteDescription, setSiteDescription] = useState(
    initial.site_description
  );
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeadline(e.target.value);
  };
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };
  const handleSiteDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSiteDescription(e.target.value);
  };

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const request: ProfilePutRequest = {
        headline,
        bio,
        site_description: siteDescription,
      };
      const response = await put<ProfilePutResponse, ProfilePutRequest>(
        API_ENDPOINTS.profile.put,
        request
      );
      logger.info('[about] プロフィールを更新しました');
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      useToastStore.getState().show({
        type: 'success',
        message: response.message,
      });
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsSaving(false);
    }
  }, [headline, bio, siteDescription, showError, queryClient]);

  return {
    headline,
    bio,
    siteDescription,
    isSaving,
    handleHeadlineChange,
    handleBioChange,
    handleSiteDescriptionChange,
    save,
  };
}

export default useProfileForm;
