import { menuItemTable, menuTable } from "~/server/db/schema";
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

type Database = PlanetScaleDatabase<typeof import("~/server/db/schema")>;

export const getMenuByDate = async (db: Database, date: Date) => {
  try {
    return db.query.menuTable.findFirst({
      where: (menus, { eq }) => eq(menus.date, date),
      with: {
        menuItems: true,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const insertMenu = async (
  db: Database,
  date: Date,
  menuItemsParsed: string[],
) => {
  const newMenu = await db.insert(menuTable).values({
    date: date,
  });

  const menuId = parseInt(newMenu.insertId);

  return db.insert(menuItemTable).values(
    menuItemsParsed.map((item) => ({
      menu: menuId,
      name: item,
    })),
  );
};
