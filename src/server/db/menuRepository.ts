import { menuItemTable, menuTable } from "~/server/db/schema";
import { type Database } from "~/server/db/types";
import { type Menu } from "~/server/models/menuLine";

const formatDateToDayString = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export const getMenuByDateFromDatabase = async (db: Database, date: Date) => {
  try {
    return await db.query.menuTable.findFirst({
      where: (menus, { eq }) => eq(menus.date, formatDateToDayString(date)),
      with: {
        menuItems: true,
      },
    });
  } catch (err) {
    return null;
  }
};

export const insertMenu = async (db: Database, date: Date, menu: Menu) => {
  await db.transaction(async (trx) => {
    console.log("text length", menu.textContent.length);
    const newMenu = await trx.insert(menuTable).values({
      text: menu.textContent,
      date: formatDateToDayString(date),
    });

    const menuId = parseInt(newMenu.insertId);

    for (const item of menu.menuItems) {
      await trx.insert(menuItemTable).values({
        menu: menuId,
        name: item.item,
        foodType: item.label,
        allergies: item.allergies.join(","),
      });
    }
  });
};
