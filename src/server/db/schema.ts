import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `tri-menu_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const menuTable = mysqlTable("menu", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const menusRelations = relations(menuTable, ({ many }) => {
  return {
    menuItems: many(menuItemTable),
  };
});

export const menuItemTable = mysqlTable(
  "menu_item",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    menu: bigint("menu_id", { mode: "number" }).notNull(),

    name: varchar("name", { length: 256 }),
    co2Estimate: bigint("co2_estimate", { mode: "number" }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const menuItemsRelations = relations(menuItemTable, ({ one }) => {
  return {
    menu: one(menuTable, {
      fields: [menuItemTable.menu],
      references: [menuTable.id],
    }),
  };
});
