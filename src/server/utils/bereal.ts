import { exiftool } from "exiftool-vendored";
import moment from "moment";
import { ofetch } from "ofetch";
import path from "path";
import sharp from "sharp";
import os from "os";
import type { Memories, Moment, Post, RefreshTokenRes } from "~/types/bereal";
import { readFile, unlink } from "fs/promises";
import consola from "consola";

export const commonHeaders = {
  "Accept-Encoding": "gzip",
  "bereal-app-language": "en-US",
  "bereal-app-version": "2.11.0",
  "bereal-app-version-code": "1021596",
  // "bereal-device-id": "",
  "bereal-device-language": "en-US",
  "bereal-os-version": "12",
  "bereal-platform": "android",
  "bereal-timezone": "Europe/Berlin",
  // "bereal-user-id": "",
  "User-Agent":
    "BeReal/2.11.0 (com.bereal.ft; build:1021596; Android 12) 4.12.0/OkHttp",
};
export const genereateHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...commonHeaders,
});

export async function fetchMemories(accessToken: string) {
  const res = await ofetch<Memories>(
    "https://mobile.bereal.com/api/feeds/memories-v1",
    { headers: genereateHeaders(accessToken) },
  );

  return res;
}

export async function fetchMoment(momentId: string, accessToken: string) {
  const res = await ofetch<Moment>(
    `https://mobile.bereal.com/api/feeds/memories-v2/${momentId}`,
    { headers: genereateHeaders(accessToken) },
  );

  return res;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await ofetch<RefreshTokenRes>(
    "https://auth.bereal.com/token?grant_type=refresh_token",
    {
      method: "POST",
      headers: commonHeaders,
      body: {
        grant_type: "refresh_token",
        client_id: "android",
        client_secret: "F5A71DA-32C7-425C-A3E3-375B4DACA406",
        refresh_token: refreshToken,
      },
    },
  );

  return res;
}

export async function generateCombinedImage(post: Post) {
  consola.start(`Generating combined image... [${post.id}]`);
  const primaryImg = sharp(
    Buffer.from(
      await ofetch(post.primary.url, { responseType: "arrayBuffer" }),
    ),
  );
  const secondaryImg = sharp(
    Buffer.from(
      await ofetch(post.secondary.url, {
        responseType: "arrayBuffer",
      }),
    ),
  );

  // Overlay images to recreate BeReal look
  consola.info(`Overlaying images [${post.id}]`);
  const { width, height } = await secondaryImg.metadata();
  if (!width || !height) {
    throw new Error("Invalid metadata");
  }
  const resizedSecondaryImg = await secondaryImg
    .resize(Math.floor(width / 3), Math.floor(height / 3))
    .toBuffer();

  const takenAt = moment(post.takenAt);
  const fileName = `bereal-${takenAt.format("YYYYMMDD_HHmmss")}.jpeg`;
  const tempPath = path.join(os.tmpdir(), fileName);
  await primaryImg
    .composite([{ input: resizedSecondaryImg, left: 25, top: 25 }])
    .jpeg()
    .toFile(tempPath);

  // Add exif data
  consola.info(`Adding exif data [${post.id}]`);
  await exiftool.write(
    tempPath,
    {
      AllDates: takenAt.format("YYYY-MM-DDTHH:mm:ss"),
    },
    { writeArgs: ["-overwrite_original"] },
  );
  const result = await readFile(tempPath);
  await unlink(tempPath);
  consola.success(`Image generation finished! [${post.id}]`);

  return { image: result, fileName };
}
