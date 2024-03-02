import { api } from "~/utils/api";
import { Spinner } from "~/components/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudIcon } from "~/components/icons";
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
import { Rating } from "~/components/menu/rating";
import { AllergyIcon, Icon } from "~/components/menu/icon";

const average = (arr: number[]): number => {
  if (arr.length === 0) {
    //throw new Error("Cannot calculate average of an empty list");
    return 0;
  }

  const sum = arr.reduce((acc, num) => acc + num, 0);
  return sum / arr.length;
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
    <>
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
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">
                    {item.item}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Icon label={item.label} />
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
                          : ""}
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
          <Rating menuId={data.menu.id} />
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
    </>
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
