'use client';

import { useEffect } from 'react';

/**
 * 未保存の変更があるとき、ブラウザのタブ閉じ/リロード/戻るで
 * 離脱確認ダイアログ（beforeunload）を出す。
 * enabled が true の間だけリスナを登録する。
 */
function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // 一部ブラウザは returnValue の設定を要求する
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);
}

export default useBeforeUnload;
