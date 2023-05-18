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
    <div className="">
      <Button
        className="w-full items-center justify-center  bg-inherit font-semibold  capitalize text-foreground
          hover:bg-primary hover:text-secondary"
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
