import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMenuFromMadklubben } from "~/server/services/menuService";
import {
  getMenuByDateFromDatabase,
  insertMenu,
} from "~/server/db/menuRepository";
import { TRPCError } from "@trpc/server";
import { type Database } from "~/server/db/types";
import { type Allergies, type FoodType } from "~/server/models/enums";
import axios from "axios";
import { type ReciepeInfo, type Recipe } from "~/server/api/routers/menu-types";

import translate from "translate";

export const menuNotFoundError = () =>
  new TRPCError({
    code: "NOT_FOUND",
    message: "Menu not found",
  });

async function calculateCo2(item: string): Promise<number> {
  let name = item;
  if (item.includes("med")) {
    name = item.split("med")[0]!;
  }

  const translatedToEnglish = await translate(name, { from: "da", to: "en" });
  console.log(translatedToEnglish);

  const recipies = await axios.get<Recipe>(
    `https://cosylab.iiitd.edu.in/carbon-food-print-2-api/api/recipes_final_new?Recipe_Name=${translatedToEnglish}&page=1`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      method: "GET",
    },
  );
  console.log(recipies.data);

  if (recipies.data === null || recipies.data.Recipe_Data.length === 0) {
    return 0;
  }
  const recipeDetails = await axios.get<ReciepeInfo>(
    `https://cosylab.iiitd.edu.in/carbon-food-print-2-api/api/recipes_final_new?Recipe_Id=${
      recipies.data.Recipe_Data[0]!.RecipeID
    }`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      method: "GET",
    },
  );

  if (
    recipeDetails.data === null ||
    recipeDetails.data.Recipe_Data.length === 0
  ) {
    return 0;
  }

  //const ingredients = recipeDetails.data.Ingredient_List;

  if (recipeDetails.data.Recipe_Data[0]!.CarbonFootprintSum === null) {
    return 0;
  }

  console.log(recipeDetails.data.Recipe_Data[0]!.RecipeName);

  const carbonFootprint = recipeDetails.data.Recipe_Data[0]!.CarbonFootprintSum;

  return carbonFootprint;
}

async function getMenuService(db: Database, date: Date) {
  let menuCached = await getMenuByDateFromDatabase(db, date);
  if (!menuCached) {
    const newMenu = await getMenuFromMadklubben(date);
    await insertMenu(db, date, newMenu);

    menuCached = await getMenuByDateFromDatabase(db, date);
    if (!menuCached) {
      throw menuNotFoundError();
    }
  }

  const itemsWithCo2 = menuCached.menuItems.map(async (item) => {
    return {
      id: item.id,
      item: item.name,
      label: item.foodType as FoodType,
      allergies: item.allergies.split(",") as Allergies[],
      co2Estimate: null, //await calculateCo2(item.name),
    };
  });
  return {
    menu: menuCached,
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
