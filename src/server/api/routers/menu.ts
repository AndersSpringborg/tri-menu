import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMenuFromMadklubben } from "~/server/services/menuService";
import { co2FromMenu } from "~/server/services/co2FromMenu";

export const menuRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input }) => {
      const items1 = await getMenuFromMadklubben(input.date);
      const items = [items1[0]!];
      const itemsWithCo2 = items.map(async (item) => {
        const co2 = await co2FromMenu(item);
        return {
          description: item,
          co2: co2,
        };
      });

      return {
        items: await Promise.all(itemsWithCo2),
      };
    }),
});
