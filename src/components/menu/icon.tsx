import { Allergies, FoodType } from "~/server/models/enums";
import { IconBadge, IconBorderBadge } from "~/components/ui/icon-button";
import {
  LucideEgg,
  LucideFish,
  LucideMilk,
  LucideNut,
  LucideShell,
  LucideSprout,
  LucideWheat,
} from "lucide-react";

export const Icon = ({ label }: { label: FoodType }) => {
  switch (label) {
    case FoodType.Beef:
      return (
        <IconBorderBadge
          color={"red"}
          description={"Oksekød"}
          icon={<span>🥩</span>}
        />
      );
    case FoodType.Vegan:
      return (
        <IconBorderBadge
          color={"green"}
          description={"Vegansk"}
          icon={<span>🌱</span>}
        />
      );
    case FoodType.Vegetarian:
      return (
        <IconBorderBadge
          color={"green"}
          description={"Vegetarisk"}
          icon={<span>🥕</span>}
        />
      );
    case FoodType.Fish:
      return (
        <IconBorderBadge
          color={"blue"}
          description={"Fisk"}
          icon={<span>🐟</span>}
        />
      );
    case FoodType.Pork:
      return (
        <IconBorderBadge
          color={"pink"}
          description={"Gris"}
          icon={<span>🐷</span>}
        />
      );
    case FoodType.Chicken:
      return (
        <IconBorderBadge
          color={"yellow"}
          description={"Kylling"}
          icon={<span>🐔</span>}
        />
      );
    case FoodType.Salat:
      return (
        <IconBorderBadge
          color={"green"}
          description={"Salat"}
          icon={<span>🥗</span>}
        />
      );
    case FoodType.Turkey:
      return (
        <IconBorderBadge
          color={"brown"}
          description={"Kalkun"}
          icon={<span>🦃</span>}
        />
      );
    default:
      return null;
  }
};
export const AllergyIcon = ({ allergy }: { allergy: Allergies }) => {
  switch (allergy) {
    case Allergies.Lactose:
      return (
        <IconBadge
          color={"blue"}
          description={`Contains ${allergy}`}
          icon={<LucideMilk />}
        />
      );
    case Allergies.Peanuts:
    case Allergies.Nuts:
      return (
        <IconBadge
          color={"brown"}
          icon={<LucideNut />}
          description={`Contains ${allergy}`}
        />
      );
    case Allergies.Soy:
    case Allergies.Celery:
      return (
        <IconBadge
          color={"black"}
          icon={<LucideSprout />}
          description={`Contains ${allergy}`}
        />
      );
    case Allergies.Egg:
      return (
        <IconBadge
          color={"yellow"}
          description={`Contains ${allergy}`}
          icon={<LucideEgg />}
        />
      );
    case Allergies.Fish:
      return (
        <IconBadge
          color={"blue"}
          description={`Contains ${allergy}`}
          icon={<LucideFish />}
        />
      );
    case Allergies.Shellfish:
      return (
        <IconBadge
          color={"black"}
          description={`Contains ${allergy}`}
          icon={<LucideShell />}
        />
      );
    case Allergies.Mustard:
    case Allergies.Molluscs:
    case Allergies.Lupin:
    case Allergies.Sulfites:
    case Allergies.Gluten:
    case Allergies.Sesame:
      return (
        <IconBadge
          color={"yellow"}
          icon={<LucideWheat />}
          description={`Contains ${allergy}`}
        />
      );

    default:
      return null;
  }
};
