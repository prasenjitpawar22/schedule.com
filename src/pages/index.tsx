import { type NextPage } from "next";
import { api } from "../utils/api";

const Home: NextPage = () => {
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

export default Home;
