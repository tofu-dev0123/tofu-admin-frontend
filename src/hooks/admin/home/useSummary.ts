'use client';

import { useState, useCallback } from 'react';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { SummaryResponse } from '@/types/api/summary';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';

interface SummaryState {
  showError: (errorMessage: string[]) => void;
}

function useSummary(props: SummaryState) {
  const { showError } = props;
  const [totalPosts, setTotalPosts] = useState(0);
  const [publishedPosts, setPublishedPosts] = useState(0);
  const [draftPosts, setDraftPosts] = useState(0);

  const getSummary = useCallback(async () => {
    try {
      const response = await get<SummaryResponse>(API_ENDPOINTS.summary.get);
      setTotalPosts(response.total_count);
      setPublishedPosts(response.published_count);
      setDraftPosts(response.draft_count);
    } catch (error) {
      exceptErrorHandling(error, showError);
    }
  }, [showError]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    getSummary,
  };
}

export default useSummary;
