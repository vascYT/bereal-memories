import { strFromU8, unzipSync, Zip, ZipPassThrough } from "fflate";
import moment from "moment";
import { z } from "zod";
import {
  dataURLToUint8Array,
  degToDmsRational,
  loadImage,
  stitchImages,
  triggerDownload,
} from "./misc.ts";
import piexif from "piexifjs";

const MediaSchema = z.object({
  bucket: z.string(),
  height: z.number(),
  width: z.number(),
  path: z.string(),
  mediaType: z.string(),
  mimeType: z.string(),
});

export const MemorySchema = z.object({
  frontImage: MediaSchema,
  backImage: MediaSchema,
  caption: z.string().optional(),
  isLate: z.boolean(),
  date: z.string(),
  takenTime: z.string(),
  berealMoment: z.string(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export type Memory = z.infer<typeof MemorySchema>;

export const MemoriesSchema = z.array(MemorySchema);

function toZipPath(path: string) {
  const folders = path.split("/");
  return `Photos/${folders.splice(path.startsWith("/") ? 3 : 2).join("/")}`;
}

const BASE_URL = "https://cdn.bereal.network/";
export function getImageUrlsFromMemory(memory: Memory) {
  return {
    frontImgUrl: BASE_URL + memory.frontImage.path,
    backImgUrl: BASE_URL + memory.backImage.path,
  };
}

export async function extractMemoriesFromZip(zipFile: File) {
  const buffer = await zipFile.arrayBuffer();
  const zipData = new Uint8Array(buffer);
  const unzipped = unzipSync(zipData);
  const memoriesRaw = unzipped["memories.json"];
  if (!memoriesRaw) throw new Error("memories.json not found in zip");

  const memoriesTxt = strFromU8(memoriesRaw);
  const memories = MemoriesSchema.parse(JSON.parse(memoriesTxt));
  return { memories, unzipped };
}

export async function generateMemoriesFromZip(
  zipFile: File,
  memoryIds: string[],
) {
  const { memories, unzipped } = await extractMemoriesFromZip(zipFile);
  const filteredMemories = memories.filter((m) =>
    memoryIds.includes(m.takenTime),
  );

  const outputChunks: BlobPart[] = [];
  const zipStream = new Zip((err, chunk, final) => {
    if (err) console.error("Zip stream error:", err);
    outputChunks.push(chunk);
    if (final) {
      const finalZipBlob = new Blob(outputChunks, { type: "application/zip" });
      const finalZipUrl = URL.createObjectURL(finalZipBlob);
      triggerDownload(finalZipUrl, "bereal-export.zip");
      setTimeout(() => URL.revokeObjectURL(finalZipUrl), 1000);
    }
  });

  for (const memory of filteredMemories) {
    console.debug(`Processing memory at ${memory.takenTime}`);
    if (
      memory.frontImage.mediaType !== "image" ||
      memory.backImage.mediaType !== "image"
    ) {
      console.warn("Skipping non-image post");
      continue;
    }

    const frontImgPath = toZipPath(memory.frontImage.path);
    const frontImgRaw = unzipped[frontImgPath];
    const backImgPath = toZipPath(memory.backImage.path);
    const backImgRaw = unzipped[backImgPath];

    if (!frontImgRaw || !backImgRaw) {
      console.warn(
        `Missing images for memory at ${memory.takenTime}, skipping...`,
      );
      console.log(frontImgPath);
      console.log(backImgPath);
      continue;
    }

    const frontImgUrl = URL.createObjectURL(
      new Blob([frontImgRaw], { type: memory.frontImage.mimeType }),
    );
    const backImgUrl = URL.createObjectURL(
      new Blob([backImgRaw], { type: memory.backImage.mimeType }),
    );

    delete unzipped[frontImgPath];
    delete unzipped[backImgPath];

    try {
      const frontImg = await loadImage(frontImgUrl);
      const backImg = await loadImage(backImgUrl);

      const takenTime = moment(memory.takenTime);
      const fileName = `bereal-${takenTime.format("YYYYMMDD_HHmmss")}.jpeg`;
      const exifDate = takenTime.format("YYYY:MM:DD HH:mm:ss");

      const jpegDataUrl = await stitchImages(frontImg, backImg);

      // write exif data
      const zerothIFD: Record<number, any> = {};
      const exifIFD: Record<number, any> = {};
      const gpsIFD: Record<number, any> = {};

      zerothIFD[piexif.ImageIFD.DateTime] = exifDate;
      exifIFD[piexif.ExifIFD.DateTimeOriginal] = exifDate;
      exifIFD[piexif.ExifIFD.DateTimeDigitized] = exifDate;

      if (memory.location) {
        const lat = memory.location.latitude;
        const lng = memory.location.longitude;

        gpsIFD[piexif.GPSIFD.GPSLatitudeRef] = lat >= 0 ? "N" : "S";
        gpsIFD[piexif.GPSIFD.GPSLongitudeRef] = lng >= 0 ? "E" : "W";

        gpsIFD[piexif.GPSIFD.GPSLatitude] = degToDmsRational(lat);
        gpsIFD[piexif.GPSIFD.GPSLongitude] = degToDmsRational(lng);

        gpsIFD[piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
      }

      const exifObj = { "0th": zerothIFD, Exif: exifIFD, GPS: gpsIFD };

      const exifBytes = piexif.dump(exifObj);
      const modifiedJpegDataUrl = piexif.insert(exifBytes, jpegDataUrl);

      const fileStream = new ZipPassThrough(fileName);
      zipStream.add(fileStream);
      fileStream.push(dataURLToUint8Array(modifiedJpegDataUrl), true);
    } finally {
      URL.revokeObjectURL(frontImgUrl);
      URL.revokeObjectURL(backImgUrl);
    }
    console.debug(`Finished processing memory at ${memory.takenTime}`);
  }

  zipStream.end();
}
