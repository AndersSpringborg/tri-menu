import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMenuFromMadklubben } from "~/server/services/menuService";
import {
  getMenuByDateFromDatabase,
  insertMenu,
} from "~/server/db/menuRepository";
import { TRPCError } from "@trpc/server";
import { type Database } from "~/server/db/types";

export const menuNotFoundError = () =>
  new TRPCError({
    code: "NOT_FOUND",
    message: "Menu not found",
  });

async function getMenuService(db: Database, date: Date) {
  let menuCached = await getMenuByDateFromDatabase(db, date);
  if (!menuCached) {
    const newMenuItems = await getMenuFromMadklubben(date);
    await insertMenu(db, date, newMenuItems);

    menuCached = await getMenuByDateFromDatabase(db, date);
    if (!menuCached) {
      throw menuNotFoundError();
    }
  }

  const itemsWithCo2 = menuCached.menuItems.map(async (item) => {
    //const co2 = await co2FromMenu(item);
    return {
      description: item,
      co2: null,
      menus: menuCached,
    };
  });

  return {
    items: await Promise.all(itemsWithCo2),
  };
}

export const menuRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      return await getMenuService(ctx.db, input.date);
    }),
});
