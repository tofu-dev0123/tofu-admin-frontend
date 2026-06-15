/**
 * 本文中のマークダウン画像構文からURLを抽出する
 * @param content - 本文の文字列
 * @returns 抽出されたURLの配列
 * @example
 * const content = "本文です。![画像1](https://example.com/image1.jpg) 続きのテキスト。![画像2](https://example.com/image2.png)";
 * const urls = extractImageUrls(content);
 * // 戻り値: ["https://example.com/image1.jpg", "https://example.com/image2.png"]
 */
export function extractImageUrls(content: string): string[] {
  const imageUrlPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = imageUrlPattern.exec(content)) !== null) {
    const url = match[2]?.trim();
    // 空文字列や空白のみのURLは除外
    if (url && url.length > 0) {
      urls.push(url);
    }
  }

  return urls;
}
