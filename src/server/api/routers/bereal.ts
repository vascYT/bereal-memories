import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import JSZip from "jszip";
import consola from "consola";
import {
  fetchMemories,
  fetchMoment,
  generateCombinedImage,
  refreshAccessToken,
} from "~/server/utils/bereal";

export const berealRouter = createTRPCRouter({
  memories: publicProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const res = await fetchMemories(input.accessToken);

      return res;
    }),
  moment: publicProcedure
    .input(z.object({ accessToken: z.string(), momentId: z.string() }))
    .query(async ({ input }) => {
      const res = await fetchMoment(input.momentId, input.accessToken);

      return res;
    }),
  refreshToken: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const res = await refreshAccessToken(input.refreshToken);

      return res;
    }),
  generateImage: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        momentId: z.string(),
        postIndex: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const momentRes = await fetchMoment(input.momentId, input.accessToken);

      const post = momentRes.posts[input.postIndex];
      if (!post) return { error: "Invalid index" };

      const { image, fileName } = await generateCombinedImage(post);

      return { image: image.toString("base64"), fileName };
    }),
  generateImages: publicProcedure
    .input(
      z.object({ accessToken: z.string(), momentIds: z.array(z.string()) }),
    )
    .mutation(async ({ input }) => {
      try {
        const zip = new JSZip();

        for (const momentId of input.momentIds) {
          const momentRes = await fetchMoment(momentId, input.accessToken);

          for (const post of momentRes.posts) {
            const { fileName, image } = await generateCombinedImage(post);

            zip.file(fileName, image);
          }
        }

        const generatedZip = await zip.generateAsync({ type: "base64" });
        return { zip: generatedZip };
      } catch (e) {
        consola.error(e);
      }

      return { error: "An error occurred" };
    }),
});
