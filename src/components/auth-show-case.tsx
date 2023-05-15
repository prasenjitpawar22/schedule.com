import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4 border-t pt-4">
      {/* <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p> */}
      <Button
        // variant={"outline"}
        className="w-full items-center justify-center  bg-inherit font-semibold  capitalize text-foreground
          hover:bg-primary hover:text-secondary"
        // className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="xs:hidden lg:block">Sign out</span>
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            <span className="xs:hidden lg:block">Sign in</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AuthShowcase;
