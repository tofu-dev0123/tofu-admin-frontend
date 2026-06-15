/**
 * 画像トリミング用ユーティリティ関数
 * 16:9アスペクト比で中央トリミングを行う
 */

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * 画像サイズとアスペクト比から中央トリミング領域を計算
 * @param imgWidth - 元画像の幅
 * @param imgHeight - 元画像の高さ
 * @param aspect - 目標アスペクト比（幅/高さ）
 * @returns トリミング領域
 */
export function getCenterCrop(
  imgWidth: number,
  imgHeight: number,
  aspect: number
): CropArea {
  const imgAspect = imgWidth / imgHeight;

  let cropWidth: number;
  let cropHeight: number;

  if (imgAspect > aspect) {
    // 横長 → 高さ基準でトリミング
    cropHeight = imgHeight;
    cropWidth = imgHeight * aspect;
  } else {
    // 縦長 → 幅基準でトリミング
    cropWidth = imgWidth;
    cropHeight = imgWidth / aspect;
  }

  return {
    x: (imgWidth - cropWidth) / 2,
    y: (imgHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
}

/**
 * 画像を16:9アスペクト比で中央トリミングし、Blobに変換
 * @param imageSrc - 画像のURL（Blob URLまたはData URL）
 * @param aspect - 目標アスペクト比（デフォルト: 16/9）
 * @param mimeType - 出力MIMEタイプ（デフォルト: 'image/jpeg'）
 * @param quality - JPEG品質（0-1、デフォルト: 0.9）
 * @returns トリミングされた画像のBlob
 */
export async function cropImageToBlob(
  imageSrc: string,
  aspect = 16 / 9,
  mimeType: string = 'image/jpeg',
  quality = 0.9
): Promise<Blob> {
  const img = new Image();
  img.src = imageSrc;
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  const crop = getCenterCrop(img.width, img.height, aspect);

  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas not supported');
  }

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Blob conversion failed'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}
