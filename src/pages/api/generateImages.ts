import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from "ofetch";
import sharp from "sharp";
import { z } from "zod";
import { genereateHeaders } from "~/server/api/routers/bereal";
import type { Moment } from "~/types/bereal";
import JSZip from "jszip";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return;

  const { data: body } = z
    .object({ accessToken: z.string(), momentIds: z.array(z.string()) })
    .safeParse(req.body);

  if (!body) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const zip = new JSZip();

  for (const momentId of body.momentIds) {
    const momentRes = await ofetch<Moment>(
      `https://mobile.bereal.com/api/feeds/memories-v2/${momentId}`,
      { headers: genereateHeaders(body.accessToken) },
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

      const takenAt = moment.utc(post.takenAt);
      // TODO: Exif data
      // const takenAtStr = takenAt.format("YYYY:MM:DD HH:mm:ss");

      // Overlay images to recreate BeReal look
      const { width, height } = await secondaryImg.metadata();
      if (!width || !height) break;
      const resizedSecondaryImg = await secondaryImg
        .resize(Math.floor(width / 3), Math.floor(height / 3))
        .toBuffer();
      const compositedImg = await primaryImg
        .composite([{ input: resizedSecondaryImg, left: 25, top: 25 }])
        .jpeg()
        .toBuffer();

      zip.file(
        `bereal-${takenAt.format("YYYYMMDD_HHmmss")}.jpeg`,
        compositedImg,
      );
    }
  }

  const generatedZip = await zip.generateAsync({ type: "nodebuffer" });
  res.send(generatedZip);
}
