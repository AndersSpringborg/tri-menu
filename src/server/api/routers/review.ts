import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  updateDislikesMenu,
  updateLikesMenu,
} from "~/server/db/menuRepository";

// create endpoint for liking or disliking a days menu
export const likeRouter = createTRPCRouter({
  addLike: publicProcedure
    .input(
      z.object({
        menuId: z.number(),
        like: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateLikesMenu(ctx.db, input.menuId, input.like);
    }),
  addDislike: publicProcedure
    .input(
      z.object({
        menuId: z.number(),
        dislike: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateDislikesMenu(ctx.db, input.menuId, input.dislike);
    }),
});
