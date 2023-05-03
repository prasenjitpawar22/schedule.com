import { type NextPage } from "next";
import { ReactElement } from "react";
import { api } from "../utils/api";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  if (!hello) return null;

  console.log(hello.data);

  return (
    <>
      <div>
        {" "}
        <p> {hello.data?.greeting} </p>{" "}
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};

export default Home;
