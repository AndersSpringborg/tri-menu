import { createTRPCRouter } from "~/server/api/trpc";
import { menuRouter } from "~/server/api/routers/menu";
import { likeRouter } from "~/server/api/routers/review";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  menu: menuRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
