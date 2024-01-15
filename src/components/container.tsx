import { cn } from "~/utils";
import React from "react";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8",
      className,
    )}
  >
    {children}
  </div>
);
