import type { Mermaid } from 'mermaid';

let mermaidInstance: Mermaid | null = null;

/**
 * mermaid を動的 import し、初回のみ初期化して返す。
 * SSR 回避と初期バンドル肥大の防止のため、クライアントで遅延ロードする。
 */
async function getMermaid(): Promise<Mermaid> {
  if (!mermaidInstance) {
    const mod = await import('mermaid');
    mermaidInstance = mod.default;
    mermaidInstance.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'strict',
    });
  }
  return mermaidInstance;
}

/**
 * Mermaid のソースを SVG 文字列に変換する。
 * 構文エラー時は例外を投げるため、呼び出し側で握りつぶすこと。
 */
export async function renderMermaid(id: string, code: string): Promise<string> {
  const mermaid = await getMermaid();
  const { svg } = await mermaid.render(id, code);
  return svg;
}
