import React from 'react';
import { cn } from '~/utils';

export const Page = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <main className={cn('w-full max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-0', className)}>
      {children}
    </main>);
};