import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { NextPageWithLayout } from "../_app";
import { FormEvent, ReactElement, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { BsDiscord } from "react-icons/bs";
import { getServerAuthSession } from "@/src/server/auth";
import { api, client } from "@/src/utils/api";
import { useRouter } from "next/router";
import { Badge } from "@/src/components/ui/badge";
const SignIn = ({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const email = useRef("");
  const password = useRef("");
  const router = useRouter();
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email: email.current,
      password: password.current,
      redirect: false,
      callbackUrl: "/",
    })
      .then((res) => {
        if (res?.url)
          router
            .push(res?.url)
            .then((e) => {
              return;
            })
            .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };
  console.log(providers);

  if (!providers) return <div>Loading</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      {/*TODO: think about  password based auth  */}
      {/* <form onSubmit={handleLogin} className="flex flex-col items-center gap-2">
        <Input
          autoFocus
          onChange={(e) => (email.current = e.target.value)}
          type="email"
          placeholder="email"
          id="email"
          name="email"
        />
        <Input
          onChange={(e) => (password.current = e.target.value)}
          type="password"
          placeholder="******"
          id="password"
          name="password"
        />
        <Button className="w-full" size={"default"} type="submit">
          Sign
        </Button>
      </form> */}
      {providers &&
        Object.values(providers).map(
          (provider) =>
            provider.name !== "Credentials" &&
            provider.name !== "Google" &&
            provider.name !== "Twitter (Legacy)" && (
              <div key={provider.name}>
                <Button
                  variant={"ghost"}
                  className="flex items-center gap-2 "
                  onClick={() => {
                    signIn(provider.id)
                      .then(() => {
                        return;
                      })
                      .catch((e) => console.log(e));
                  }}
                >
                  {provider.name === "Google" && <FcGoogle size={20} />}
                  {provider.name === "GitHub" && <BsGithub size={18} />}
                  {provider.name === "Discord" && (
                    <BsDiscord color="#5865F2" size={20} />
                  )}
                  {provider.name === "Twitter (Legacy)" && (
                    <BsTwitter color="#1DA1F2" size={20} />
                  )}
                  Sign in with {provider.name.split("(")[0]}
                </Button>
              </div>
            )
        )}
      {router.query?.error === "OAuthAccountNotLinked" && (
        <Badge variant={"destructive"}>
          Please sign in with the same linked account!
        </Badge>
      )}

      {/* TODO: twitter error */}
      {router.query?.error === "OAuthSignin" && (
        <Badge variant={"destructive"}>
          Something went wrong, please try to sign in different provider!
        </Badge>
      )}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  const csrfToken = await getCsrfToken(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  //   console.info("in", session, csrfToken, providers, "out");
  return {
    props: { providers: providers ?? [], csrfToken },
  };
}

export default SignIn;

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};
