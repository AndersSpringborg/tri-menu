import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const menuRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ input }) => {
      return {
        items: [
          '🍕 Pizza',
          '🍔 Burger',
          ]
      };
    }),
});
