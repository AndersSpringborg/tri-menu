import { useRouter } from "next/router";
import React from "react";
import { ThemePicker } from "~/components/theme-picker";

interface NavigationProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const DateNavigation = ({ currentDate }: NavigationProps) => {
  const date = currentDate || new Date();
  const router = useRouter();
  const handleNextDay = async () => {
    const nextDay = new Date(currentDate || Date.now());
    nextDay.setDate(nextDay.getDate() + 1);
    await router.push(
      router.pathname + `?date=${nextDay.toISOString().slice(0, 10)}`,
    );
  };

  const handlePrevDay = async () => {
    const prevDay = new Date(currentDate || Date.now());
    prevDay.setDate(prevDay.getDate() - 1);
    await router.push(
      router.pathname + `?date=${prevDay.toISOString().slice(0, 10)}`,
    );
  };

  const handleToday = async () => {
    await router.push(
      router.pathname + `?date=${new Date().toISOString().slice(0, 10)}`,
    );
  };

  const DateComponent = () => (
    <span className="w-full items-center text-center font-mono text-base dark:text-white">
      {date?.toLocaleDateString("en-GB")}
    </span>
  );

  return (
    <nav className="p-4">
      <div className={"absolute inset-y-0 left-0 flex p-4"}>
        <ThemePicker />
      </div>
      <div className="flex items-center justify-between p-2">
        <DateComponent />
      </div>
      <div className="flex items-center justify-between rounded-l rounded-r bg-gray-200 dark:bg-gray-800 dark:text-gray-200 ">
        <button
          onClick={handlePrevDay}
          className="col-span-1 rounded-l px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Prev
        </button>
        <button
          onClick={handleToday}
          className="col-span-1 flex-auto rounded-r px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Today
        </button>
        <button
          onClick={handleNextDay}
          className="col-span-1 rounded-r px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </nav>
  );
};
