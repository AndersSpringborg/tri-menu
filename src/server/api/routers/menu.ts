import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMenuFromMadklubben } from "~/server/services/menuService";
import { getMenuByDate, insertMenu } from "~/server/db/menuRepository";
import { TRPCError } from "@trpc/server";

export const menuNotFoundError = () =>
  new TRPCError({
    code: "NOT_FOUND",
    message: "Menu not found",
  });

export const menuRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      const menus = await getMenuByDate(ctx.db, input.date);
      if (!menus) {
        const newMenuItems = await getMenuFromMadklubben(input.date);
        const insertedMenus = await insertMenu(
          ctx.db,
          input.date,
          newMenuItems,
        );
        insertedMenus.rows.forEach((row) => {
          console.log(row);
        });
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Menu not found",
        });
      }

      const itemsWithCo2 = menus.menuItems.map(async (item) => {
        //const co2 = await co2FromMenu(item);
        return {
          description: item,
          co2: null,
          menus: menus,
        };
      });

      return {
        items: await Promise.all(itemsWithCo2),
      };
    }),
});
