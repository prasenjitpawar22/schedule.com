import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="">
      {sessionData ? (
        <Button
          className="w-full items-center justify-center  bg-inherit font-semibold  capitalize text-foreground
       hover:bg-primary hover:text-secondary"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          <>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="xs:hidden lg:block">Sign out</span>
          </>
        </Button>
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
    </div>
  );
};

export default AuthShowcase;
