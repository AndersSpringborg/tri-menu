import { api } from "~/utils/api";
import { Spinner } from "~/components/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudIcon, ThumbsDownIcon, ThumbsUpIcon } from "~/components/icons";
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
import { IconBadge, IconBorderBadge } from "~/components/ui/icon-button";
import { Allergies, FoodType } from "~/server/models/enums";
import {
  LucideEgg,
  LucideFish,
  LucideMilk,
  LucideNut,
  LucideShell,
  LucideSprout,
  LucideWheat,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "~/components/ui/skeleton";

const average = (arr: number[]): number => {
  if (arr.length === 0) {
    //throw new Error("Cannot calculate average of an empty list");
    return 0;
  }

  const sum = arr.reduce((acc, num) => acc + num, 0);
  return sum / arr.length;
};

const FoodIcon = ({ label }: { label: FoodType }) => {
  switch (label) {
    case FoodType.Beef:
      return <IconBorderBadge color={"red"} icon={<span>🥩</span>} />;
    case FoodType.Vegan:
      return <IconBorderBadge color={"green"} icon={<span>🌱</span>} />;
    case FoodType.Vegetarian:
      return <IconBorderBadge icon={<span>🥕</span>} />;
    case FoodType.Fish:
      return <IconBorderBadge color={"blue"} icon={<span>🐟</span>} />;
    case FoodType.Pork:
      return <IconBorderBadge color={"pink"} icon={<span>🐷</span>} />;
    case FoodType.Chicken:
      return <IconBorderBadge color={"yellow"} icon={<span>🐔</span>} />;
    case FoodType.Salat:
      return <IconBorderBadge color={"green"} icon={<span>🥗</span>} />;
    case FoodType.Turkey:
      return <IconBorderBadge color={"brown"} icon={<span>🦃</span>} />;
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
      return (
        <IconBadge
          color={"brown"}
          icon={<LucideNut />}
          description={"Contains Nuts"}
        />
      );
    case Allergies.Soy:
    case Allergies.Celery:
      return (
        <IconBadge
          color={"black"}
          icon={<LucideSprout />}
          description={"Contains Celery"}
        />
      );
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

function Rating({ menuId }: { menuId: number }) {
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const utils = api.useUtils();

  const undoAddLike = api.like.addLike.useMutation({});
  const optimisticAddLike = api.like.addLike.useMutation({
    onError: (error) => {
      toast.error("Something went wrong", {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success("Like saved", {
        description: new Date().toDateString(),
        action: {
          label: "Undo",
          onClick: () => {
            undoAddLike.mutate({
              menuId,
              like: false,
            });
          },
        },
      });
    },
    onSettled: async () => {
      setLikeLoading(false);
      await utils.like.getLikes.invalidate({ menuId });
    },
  });
  const undoAddDislike = api.like.addDislike.useMutation({});
  const optimisticAddDislike = api.like.addDislike.useMutation({
    onError: (error) => {
      toast.error("Something went wrong", {
        description: error.message,
      });
    },
    onSuccess: (res) => {
      toast.success("Dislike saved", {
        description: new Date().toDateString(),
        action: {
          label: "Undo",
          onClick: () => {
            undoAddDislike.mutate({
              menuId,
              dislike: false,
            });
          },
        },
      });
    },
    onSettled: async () => {
      await utils.like.getLikes.refetch({ menuId });
      setDislikeLoading(false);
    },
  });

  const handleLike = async () => {
    setLikeLoading(true);
    void optimisticAddLike
      .mutateAsync({
        menuId,
        like: true,
      })
      .then(() => {
        setLikeLoading(false);
      });
  };

  const handleDislike = async () => {
    setDislikeLoading(true);
    void optimisticAddDislike
      .mutateAsync({
        menuId,
        dislike: true,
      })
      .then(() => {
        setDislikeLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex justify-center gap-4">
        <Button
          disabled={likeLoading || dislikeLoading}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-700"
          onClick={handleLike}
        >
          {likeLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUpIcon className="mr-2 h-4 w-4" />
          )}
          Like
        </Button>
        <Button
          disabled={likeLoading || dislikeLoading}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 dark:bg-red-700"
          onClick={handleDislike}
        >
          {dislikeLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsDownIcon className="mr-2 h-4 w-4" />
          )}
          Dislike
        </Button>
      </div>
      <RatingStats menuId={menuId} />
    </div>
  );
}

const RatingStats = ({ menuId }: { menuId: number }) => {
  const { data, error } = api.like.getLikes.useQuery({
    menuId,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <Skeleton className={"h-2 w-96"} />;
  }

  const { likes, dislikes } = data;
  const noVotes = likes + dislikes === 0;

  return (
    <div>
      <Progress
        className="w-96 bg-red-500"
        indicatorClassName={"bg-green-500"}
        value={noVotes ? 50 : (likes / (likes + dislikes)) * 100}
      />
    </div>
  );
};
