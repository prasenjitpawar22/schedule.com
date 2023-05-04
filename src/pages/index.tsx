import { type NextPage } from "next";
import Link from "next/link";
import { ReactElement } from "react";
import { api } from "../utils/api";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  if (!hello) return null;

  console.log(hello.data);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        {" "}
        <p className="text-4xl"> {`Landing Page`} </p>{" "}
        <Link href={"/events"}>Events</Link>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};

export default Home;
