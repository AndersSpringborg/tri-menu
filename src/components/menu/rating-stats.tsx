import { api } from "~/utils/api";
import { Skeleton } from "~/components/ui/skeleton";
import { Progress } from "~/components/ui/progress";

export const RatingStats = ({ menuId }: { menuId: number }) => {
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
