export interface Recipe {
  Recipe_Data: RecipeDaum[];
  nbHits: number;
  Ingredient_List: string[];
  total_count: number;
  total_pages: number;
}

export interface RecipeDaum {
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

export interface ReciepeInfo {
  Recipe_Data: RecipeDaum[];
  nbHits: number;
  Ingredient_List: string[];
  total_count: number;
  total_pages: number;
}

export interface RecipeDaum {
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

export interface IngredientDetails {
  Ingredient_Data: IngredientDaum[];
  nbHits: number;
  total_count: number;
  total_pages: number;
}

export interface IngredientDaum {
  _id: string;
  Ingredient: string;
  SueatableIngredient: string;
  Similarity: number;
  CarbonFootprint: number;
  Count: number;
}
