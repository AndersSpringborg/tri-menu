// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

export type Database = PlanetScaleDatabase<typeof import("~/server/db/schema")>;