import { api } from "~/utils/api";
import { Spinner } from "~/components/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudIcon, ThumbsDownIcon, ThumbsUpIcon } from "~/components/icons";
import { Container } from "~/components/container";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { BeefIcon, IconBadge } from "~/components/ui/icon-button";
import { Allergies, FoodType } from "~/server/models/enums";
import {
  LucideDrumstick,
  LucideEgg,
  LucideFish,
  LucideFishSymbol,
  LucideMilk,
  LucideNut,
  LucidePiggyBank,
  LucideShell,
  LucideSprout,
  LucideWheat,
} from "lucide-react";

const average = (arr: number[]): number => {
  if (arr.length === 0) {
    //throw new Error("Cannot calculate average of an empty list");
    return 0;
  }

  const sum = arr.reduce((acc, num) => acc + num, 0);
  return sum / arr.length;
};

const FoodIconSwitch = ({ label }: { label: FoodType }) => {
  switch (label) {
    case FoodType.Beef:
      return {
        color: "red-500",
        node: <BeefIcon />,
      };
    case FoodType.Vegan:
      return {
        color: "green-500",
        node: <LucideSprout />,
      };

    default:
      return {
        color: "blue-500",
        node: <LucideSprout />,
      };
  }
};

const FoodIcon = ({ label }: { label: FoodType }) => {
  switch (label) {
    case FoodType.Beef:
      return <IconBadge color={"red"} icon={<BeefIcon />} />;
    case FoodType.Vegan:
      return <IconBadge color={"green"} icon={<LucideSprout />} />;
    case FoodType.Vegetarian:
      return <IconBadge color={"green"} icon={<LucideSprout />} />;
    case FoodType.Fish:
      return <IconBadge color={"blue"} icon={<LucideFishSymbol />} />;
    case FoodType.Pork:
      return <IconBadge color={"pink"} icon={<LucidePiggyBank />} />;
    case FoodType.Chicken:
      return <IconBadge color={"yellow"} icon={<LucideDrumstick />} />;
    case FoodType.Salat:
    case FoodType.Turkey:
    default:
      return null;
  }
};
const AllergyIcon = ({ allergy }: { allergy: Allergies }) => {
  switch (allergy) {
    case Allergies.Lactose:
      return <IconBadge color={"blue"} icon={<LucideMilk />} />;
    case Allergies.Peanuts:
    case Allergies.Nuts:
      return <IconBadge color={"brown"} icon={<LucideNut />} />;
    case Allergies.Soy:
    case Allergies.Celery:
      return <IconBadge color={"black"} icon={<LucideSprout />} />;
    case Allergies.Egg:
      return <IconBadge color={"yellow"} icon={<LucideEgg />} />;
    case Allergies.Fish:
      return <IconBadge color={"blue"} icon={<LucideFish />} />;
    case Allergies.Shellfish:
      return <IconBadge color={"black"} icon={<LucideShell />} />;
    case Allergies.Mustard:
    case Allergies.Molluscs:
    case Allergies.Lupin:
    case Allergies.Sulfites:
    case Allergies.Gluten:
    case Allergies.Sesame:
      return <IconBadge color={"yellow"} icon={<LucideWheat />} />;

    default:
      return null;
  }
};

export function Menu({ date }: { date: Date }) {
  const { data, error } = api.menu.getItems.useQuery(
    {
      date: date,
    },
    {
      retry: 2,
    },
  );

  if (error) {
    // Error state
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="mb-8 text-4xl font-bold">Menu</h1>
        <p className="whitespace-break-spaces text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    // Loading state
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="mb-8 text-4xl font-bold">Menu</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <Container>
      <Card className="p-6">
        <CardHeader>
          <h1 className="mb-6 text-center text-2xl font-semibold">
            {date === new Date()
              ? "Dagens Menu"
              : dateToWeekdayDanish(date) + "s Menu"}
          </h1>
        </CardHeader>
        <CardContent className="text-sm">
          <Table>
            <TableCaption>
              Co2 estimaterne er baseret på{" "}
              <Button className="p-0" variant="link">
                <Link href="https://denstoreklimadatabase.dk/en">
                  Den store klimadatabase
                </Link>
              </Button>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Ret</TableHead>
                <TableHead></TableHead>
                <TableHead>Allergener</TableHead>
                <TableHead className="w-16 text-right">Co2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">
                    {item.item}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <FoodIcon label={item.label} />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    <div className="flex gap-2">
                      {item.allergies.map((allergy) => (
                        <AllergyIcon key={allergy} allergy={allergy} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`flex w-14 items-center gap-2 text-xs`}>
                      <p>
                        {item.co2Estimate
                          ? String(item.co2Estimate) + "kg"
                          : "N/A"}
                      </p>
                      <CloudIcon className="h-4 w-4" />
                    </span>
                    {item.co2Estimate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Gennemsnitlig Co2 i dag</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {average(data.items.map((i) => i.co2Estimate ?? 0))}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {date == new Date() || true ? (
        <div className="flex flex-col items-center space-y-1.5 p-6">
          <h4 className="text-l font-medium">{"Did you like today's menu?"}</h4>
          <Rating />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-1.5 p-6 text-center">
          <h4 className="text-l font-medium">
            {"This menu got a rating of: "}
            <Progress className="w-96" value={0.8 * 100} />
            {date.toLocaleString()}
          </h4>
        </div>
      )}
    </Container>
  );
}

const dateToWeekdayDanish = (date: Date) => {
  const weekdays = [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
  ];
  return weekdays[date.getDay()];
};
const dateToWeekday = (date: Date) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[date.getDay()];
};

function Rating() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center gap-4">
        <Button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-700">
          <ThumbsUpIcon className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 dark:bg-red-700">
          <ThumbsDownIcon className="mr-2 h-4 w-4" />
          Dislike
        </Button>
      </div>
    </div>
  );
}
