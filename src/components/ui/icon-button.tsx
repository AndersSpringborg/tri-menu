import { Button } from "~/components/ui/button";
import { cn } from "~/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const colors = {
  default: `[#d3d3d3]`,
  red: `[#e74c3c]`,
  green: `[#2ecc71]`,
  blue: `[#2e8fcc]`,
  pink: `[#d754ba]`,
  yellow: `[#f0c14b]`,
  brown: `[#a0522d]`,
  black: `[#000000]`,
  white: `[#ffffff]`,
};

const iconVariants = cva("h-6 w-6 p-1 text-white", {
  variants: {
    color: {
      default: `bg-${colors.default}`,
      red: `bg-${colors.red}`,
      green: `bg-${colors.green}`,
      blue: `bg-${colors.blue}`,
      pink: `bg-${colors.pink}`,
      yellow: `bg-${colors.yellow}`,
      brown: `bg-${colors.brown}`,
      black: `bg-${colors.black}`,
      white: `bg-${colors.white}`,
    },
  },
  defaultVariants: {
    color: "default",
  },
});

interface IconBadgeProps extends VariantProps<typeof iconVariants> {
  className?: string;
  description?: string;
  icon: React.ReactNode;
}
export const IconBadge = ({
  color,
  icon,
  className,
  description,
}: IconBadgeProps) => {
  // show description on hover
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(iconBorderVariants({ color }), className)}
            size="icon"
            variant="ghost"
          >
            {icon}
            <span className="sr-only">{description}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="rounded-md bg-black bg-opacity-80 p-1 text-white dark:text-black">
            {description}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const iconBorderVariants = cva("rounded-full border border-dashed p-1", {
  variants: {
    color: {
      default: `border-${colors.default}`,
      red: `border-${colors.red}`,
      green: `border-${colors.green}`,
      blue: `border-${colors.blue}`,
      pink: `border-${colors.pink}`,
      yellow: `border-${colors.yellow}`,
      brown: `border-${colors.brown}`,
      black: `border-${colors.black}`,
      white: `border-${colors.white}`,
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const IconBorderBadge = ({ color, icon, className }: IconBadgeProps) => {
  return (
    <Button
      className={cn(iconBorderVariants({ color }), className)}
      variant={"outline"}
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
