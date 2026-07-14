// About（公開サイトの自己紹介）ページ管理用の型。
// バックエンド: /admin/profile（シングルトン）と /admin/timelines（CRUD）。

// ===== プロフィール（シングルトン） =====

export type ProfileResponse = {
  headline: string;
  bio: string;
  site_description: string;
};

export type ProfilePutRequest = {
  headline: string;
  bio: string;
  site_description: string;
};

export type ProfilePutResponse = {
  message: string;
};

// ===== 年表（Timeline） =====

export type Timeline = {
  timeline_id: number;
  year: number;
  title: string | null;
  body: string | null;
  sort_order: number;
};

export type TimelineListResponse = {
  timelines: Timeline[];
};

// 作成・更新の入力（year 必須、title/body 任意）
export type TimelineRequest = {
  year: number;
  title: string | null;
  body: string | null;
  sort_order: number;
};

export type TimelineResponse = {
  message: string;
  timeline_id: number;
};

export type TimelineDeleteResponse = {
  message: string;
};
