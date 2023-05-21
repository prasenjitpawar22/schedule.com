import Link from "next/link";
import { ReactElement } from "react";
import { Button } from "../components/ui/button";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-1">
        <p className="text-4xl">
          {" "}
          {`Create an event and start sending invites`}{" "}
        </p>{" "}
        <Link href={"/events"}>
          <Button> Event</Button>
        </Link>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};

export default Home;
