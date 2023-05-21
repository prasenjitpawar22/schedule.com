import Image from "next/image";
import Link from "next/link";
import { ReactElement } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-1">
        <div className="relative flex flex-col items-center gap-2  p-12">
          <div className="z-50 flex flex-col items-center gap-4">
            {/* <Image
              src={"/favicon.ico"}
              height={150}
              width={150}
              alt={"schedulr"}
              className="rounded"
            />{" "} */}
            <p className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent">
              {`Create an event and start sending invites`}{" "}
            </p>{" "}
            <Link href={"/events"}>
              <Button size={"lg"} className="" title="Events">
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};

export default Home;
