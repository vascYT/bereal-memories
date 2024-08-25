import { z } from "zod";
import { ofetch } from "ofetch";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { Memories, Moment, RefreshTokenRes } from "~/types/bereal";
import JSZip from "jszip";
import sharp from "sharp";
import moment from "moment";
import { exiftool } from "exiftool-vendored";
import { readFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

export const commonHeaders = {
  "Accept-Encoding": "gzip",
  "bereal-app-language": "en-US",
  "bereal-app-version": "2.11.0",
  "bereal-app-version-code": "1021596",
  "bereal-device-id": env.BEREAL_DEVICE_ID,
  "bereal-device-language": "en-US",
  "bereal-os-version": "12",
  "bereal-platform": "android",
  "bereal-timezone": "Europe/Berlin",
  "bereal-user-id": env.BEREAL_USER_ID,
  "User-Agent":
    "BeReal/2.11.0 (com.bereal.ft; build:1021596; Android 12) 4.12.0/OkHttp",
};
export const genereateHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...commonHeaders,
});

export const berealRouter = createTRPCRouter({
  memories: publicProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const res = await ofetch<Memories>(
        "https://mobile.bereal.com/api/feeds/memories-v1",
        { headers: genereateHeaders(input.accessToken) },
      );

      return res;
    }),
  refreshToken: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const res = await ofetch<RefreshTokenRes>(
        "https://auth.bereal.com/token?grant_type=refresh_token",
        {
          method: "POST",
          headers: commonHeaders,
          body: {
            grant_type: "refresh_token",
            client_id: "android",
            client_secret: "F5A71DA-32C7-425C-A3E3-375B4DACA406",
            refresh_token: input.refreshToken,
          },
        },
      );

      return res;
    }),
  generateImages: publicProcedure
    .input(
      z.object({ accessToken: z.string(), momentIds: z.array(z.string()) }),
    )
    .mutation(async ({ input }) => {
      const zip = new JSZip();

      for (const momentId of input.momentIds) {
        const momentRes = await ofetch<Moment>(
          `https://mobile.bereal.com/api/feeds/memories-v2/${momentId}`,
          { headers: genereateHeaders(input.accessToken) },
        );

        for (const post of momentRes.posts) {
          const primaryImg = sharp(
            Buffer.from(
              await ofetch(post.primary.url, { responseType: "arrayBuffer" }),
            ),
          );
          const secondaryImg = sharp(
            Buffer.from(
              await ofetch(post.secondary.url, { responseType: "arrayBuffer" }),
            ),
          );

          // Overlay images to recreate BeReal look
          const { width, height } = await secondaryImg.metadata();
          if (!width || !height) break;
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
          await exiftool.write(
            tempPath,
            {
              AllDates: takenAt.format("YYYY-MM-DDTHH:mm:ss"),
            },
            { writeArgs: ["-overwrite_original"] },
          );
          const result = await readFile(tempPath);
          await unlink(tempPath);

          zip.file(fileName, result);
        }
      }

      const generatedZip = await zip.generateAsync({ type: "base64" });
      return { zip: generatedZip };
    }),
});
