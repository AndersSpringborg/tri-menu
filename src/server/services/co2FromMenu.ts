import axios from "axios";

export async function co2FromMenu(item: string) {
  const res = await axios.get<SustainDbResponse>(
    `https://cosylab.iiitd.edu.in/carbon-food-print-2-api/api/recipes_final_new?Recipe_Name=${item}&page=1`,
    {
      headers: {
        referer: "https://cosylab.iiitd.edu.in/carbon-food-print-2/",
      },
      method: "GET",
    },
  );

  if (res.data.Recipe_Data.length === 0) {
    return null;
  }

  return res.data.Recipe_Data[0]!.CarbonFootprintSum;
}

export interface SustainDbResponse {
  Recipe_Data: RecipeData[];
  nbHits: number;
  Ingredient_List: string[];
  total_count: number;
  total_pages: number;
}

export interface RecipeData {
  _id: string;
  RecipeID: number;
  ingredient_phrase: string;
  continent: string;
  region: string;
  sub_region: string;
  instructions: string;
  RecipeName: string;
  RecipeIngredient: string;
  TotalIngredient: number;
  AvailableIngredients: string;
  AvailableCount: number;
  NotAvailableIngredients: string;
  NotAvailableCount: number;
  AvailablePercentage: number;
  CarbonFootprintSum: number;
  Vegetarian_Recipe: string;
  Non_Vegetarian_Recipe: string;
  Miscellaneous_Recipe: string;
}
