import { describe, it, expect } from 'vitest';
import { extractImageUrls } from '@/services/admin/posts/extractImageUrls';

describe('extractImageUrls', () => {
  it('複数のマークダウン画像URLを抽出する', () => {
    const content =
      'a ![画像1](https://e.com/1.jpg) b ![画像2](https://e.com/2.png)';
    expect(extractImageUrls(content)).toEqual([
      'https://e.com/1.jpg',
      'https://e.com/2.png',
    ]);
  });

  it('alt が空でも URL を抽出する', () => {
    expect(extractImageUrls('![](https://e.com/a.jpg)')).toEqual([
      'https://e.com/a.jpg',
    ]);
  });

  it('画像構文が無ければ空配列', () => {
    expect(extractImageUrls('画像のない本文です')).toEqual([]);
  });

  it('URL が空の構文は除外する', () => {
    expect(extractImageUrls('![alt]()')).toEqual([]);
  });
});
