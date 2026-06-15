'use client';

import PostEditorBase from './PostEditorBase';
import { usePostEdit } from '@/contexts/admin/posts/PostEditContext';

function PostEditEditor() {
  const contextValue = usePostEdit();
  return <PostEditorBase contextValue={contextValue} />;
}

export default PostEditEditor;
