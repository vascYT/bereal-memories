import { z } from "zod";
import { ofetch } from "ofetch";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { Memories, RefreshTokenRes } from "~/types/bereal";

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
});
