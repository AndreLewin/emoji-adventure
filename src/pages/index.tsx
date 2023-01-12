import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const router = useRouter()

  return (
    <div className="container">
      <div>
        TODO: list of published adventures
      </div>

      {sessionData !== undefined &&
        <Button onClick={sessionData ? () => signOut() : () => signIn()}>
          {sessionData ? "Sign out" : "Sign in"}
        </Button>
      }

      {!!sessionData &&
        <Button
          onClick={() => router.push("/editor")}
        >
          Go to the editor
        </Button>
      }
      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  );
};

export default Home;