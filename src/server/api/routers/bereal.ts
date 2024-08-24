import { z } from "zod";
import { ofetch } from "ofetch";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { Memories, Moment } from "~/types/bereal";

const genereateHeaders = (accessToken: string) => ({
  "Accept-Encoding": "gzip",
  Authorization: `Bearer ${accessToken}`,
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
  moment: publicProcedure
    .input(z.object({ accessToken: z.string(), momentId: z.string() }))
    .query(async ({ input }) => {
      const res = await ofetch<Moment>(
        `https://mobile.bereal.com/api/feeds/memories-v2/${input.momentId}`,
        { headers: genereateHeaders(input.accessToken) },
      );

      return res;
    }),
});
