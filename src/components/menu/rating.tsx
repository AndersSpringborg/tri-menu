import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ThumbsDownIcon, ThumbsUpIcon } from "~/components/icons";
import { RatingStats } from "~/components/menu/rating-stats";

export function Rating({ menuId }: { menuId: number }) {
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
