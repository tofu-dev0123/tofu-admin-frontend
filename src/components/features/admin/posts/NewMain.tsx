'use client';

import PostEditor from '@/components/features/admin/posts/Editor/PostEditor';
import { DraftAutosave } from '@/components/features/admin/posts/Editor/DraftAutosave';
import { PostEditorProvider } from '@/contexts/admin/posts/PostEditorContext';

function NewMain() {
  return (
    <PostEditorProvider>
      <DraftAutosave />
      <div className="lg:w-6xl w-full flex flex-col mx-auto mb-20">
        <PostEditor />
      </div>
    </PostEditorProvider>
  );
}

export default NewMain;
