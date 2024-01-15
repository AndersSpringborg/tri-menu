import { Button } from "~/components/ui/button";
import { cn } from "~/utils";

export const IconBadge = ({
  color,
  icon,
}: {
  color: "red" | "green" | "blue" | "pink" | "yellow" | "brown" | "black";
  icon: React.ReactNode;
}) => {
  const colors = {
    red: `bg-[#dc2d10]`,
    green: `bg-[#2ECC71]`,
    blue: `bg-[#2e8fcc]`,
    pink: `bg-[#d754ba]`,
    yellow: `bg-[#f0c14b]`,
    brown: `bg-[#a0522d]`,
    black: `bg-[#000000]`,
  };

  return (
    <Button
      className={cn("h-6 w-6 p-1 text-white", colors[color])}
      variant="secondary"
    >
      {icon}
    </Button>
  );
};

export function BeefIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.5" cy="8.5" r="2.5" />
      <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z" />
      <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5" />
    </svg>
  );
}