'use client';

import { IdCard, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type useProfileForm from '@/hooks/admin/about/useProfileForm';

interface ProfileCardProps {
  profileHooks: ReturnType<typeof useProfileForm>;
}

/** プロフィール（肩書き・自己紹介・サイト説明）の編集カード */
function ProfileCard({ profileHooks }: ProfileCardProps) {
  const {
    headline,
    bio,
    siteDescription,
    isSaving,
    handleHeadlineChange,
    handleBioChange,
    handleSiteDescriptionChange,
    save,
  } = profileHooks;

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IdCard className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              プロフィール
            </h2>
            <p className="text-xs text-muted-foreground">
              肩書き・自己紹介・サイト説明
            </p>
          </div>
        </div>
        <Button onClick={save} disabled={isSaving}>
          {isSaving ? <Spinner /> : <Check />}
          保存
        </Button>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              肩書き
              <span className="ml-1 text-muted-foreground">headline</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {headline.length} / 255
            </span>
          </div>
          <Input
            type="text"
            maxLength={255}
            value={headline}
            onChange={handleHeadlineChange}
            placeholder="ソフトウェアエンジニア / Web 開発"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              自己紹介<span className="ml-1 text-muted-foreground">bio</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {bio.length} / 2000
            </span>
          </div>
          <Textarea
            rows={4}
            maxLength={2000}
            value={bio}
            onChange={handleBioChange}
            placeholder="自己紹介の文章"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              サイト説明
              <span className="ml-1 text-muted-foreground">
                site_description
              </span>
            </label>
            <span className="text-xs text-muted-foreground">
              {siteDescription.length} / 1000
            </span>
          </div>
          <Textarea
            rows={2}
            maxLength={1000}
            value={siteDescription}
            onChange={handleSiteDescriptionChange}
            placeholder="サイトの説明文"
          />
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
