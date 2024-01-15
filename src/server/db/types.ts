// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { mysqlEnum } from "drizzle-orm/mysql-core";

export type Database = PlanetScaleDatabase<typeof import("~/server/db/schema")>;

export const foodTypeDbEnum = mysqlEnum("food_type", [
  "Pork",
  "Chicken",
  "Vegetarian",
  "Vegan",
  "Unknown",
]);
