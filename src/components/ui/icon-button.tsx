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

const iconVariants = cva("p-2", {
  variants: {
    color: {
      default: `border-[#d3d3d3]`,
      red: `border-[#e74c3c]`,
      green: `border-[#2ecc71]`,
      blue: `border-[#2e8fcc]`,
      pink: `border-[#d754ba]`,
      yellow: `border-[#f0c14b]`,
      brown: `border-[#a0522d]`,
      black: `border-[#000000]`,
      white: `border-[#ffffff]`,
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(iconVariants({ color }), className)}
            variant="outline"
            size={"icon"}
          >
            {icon}
            <span className="sr-only">{description}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const iconBorderVariants = cva("rounded-full border border-dashed p-1", {
  variants: {
    color: {
      default: `border-[#d3d3d3]`,
      red: `border-[#e74c3c]`,
      green: `border-[#2ecc71]`,
      blue: `border-[#2e8fcc]`,
      pink: `border-[#d754ba]`,
      yellow: `border-[#f0c14b]`,
      brown: `border-[#a0522d]`,
      black: `border-[#000000]`,
      white: `border-[#ffffff]`,
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const IconBorderBadge = ({
  color,
  icon,
  className,
  description,
}: IconBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(iconBorderVariants({ color }), className)}
            variant={"outline"}
            size="icon"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
