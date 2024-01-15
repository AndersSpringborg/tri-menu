import { type Allergies, type FoodType } from "~/server/models/enums";

export type Menu = {
  menuItems: MenuLine[];
  textContent: string;
};

export type MenuLine = {
  allergies: Allergies[];
  label: FoodType;
  item: string;
};
