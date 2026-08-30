export function triggerDownload(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image blob"));
    img.src = src;
  });
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
export async function stitchImages(
  frontImg: HTMLImageElement,
  backImg: HTMLImageElement,
): Promise<string> {
  canvas.width = backImg.width;
  canvas.height = backImg.height;

  ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(frontImg, 25, 25, frontImg.width / 3, frontImg.height / 3);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas export failed"));
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read blob"));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
}

export function dataURLToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export function degToDmsRational(
  deg: number,
): [[number, number], [number, number], [number, number]] {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = Math.round((absolute - degrees - minutes / 60) * 3600 * 100);

  return [
    [degrees, 1],
    [minutes, 1],
    [seconds, 100],
  ];
}
