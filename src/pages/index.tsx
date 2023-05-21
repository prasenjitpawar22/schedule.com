import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Button } from "../components/ui/button";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const router = useRouter();

  const goToDashBoard = async () => {
    await router.push("/events").catch((e) => console.log(e));
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-1">
        <p className="text-4xl">
          {" "}
          {`Create an event and start sending invites`}{" "}
        </p>{" "}
        <Button onClick={() => goToDashBoard()}>Create Event</Button>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};

export default Home;
