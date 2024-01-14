import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isValidDate } from "~/utils/isValidDate";
import { DateNavigation } from "~/components/dateNavigation";
import { Spinner } from "~/components/spinner";
import { Page } from "~/components/page";
import { Menu } from "~/components/menu/menu";

export default function Home() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const dateString = router.query.date as string;
    if (dateString) {
      const date = new Date(dateString);
      setCurrentDate(date);
    }
  }, [router.query.date, setCurrentDate]);

  if (!isValidDate(currentDate)) {
    return (
      <Page>
        <DateNavigation
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <section>
          <div className="container mx-auto p-8 text-center">
            <h1 className="mb-8 text-4xl font-bold">Menu</h1>
            <Spinner />
          </div>
        </section>
      </Page>
    );
  }

  return (
    <Page>
      <DateNavigation
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <section>
        <Menu date={currentDate} />
      </section>
    </Page>
  );
}
