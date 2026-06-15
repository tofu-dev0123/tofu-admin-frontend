'use client';

import PostEditorBase from './PostEditorBase';
import { usePostEditor } from '@/contexts/admin/posts/PostEditorContext';

function PostEditor() {
  const contextValue = usePostEditor();
  return <PostEditorBase contextValue={contextValue} />;
}

export default PostEditor;
