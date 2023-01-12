import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Editor: NextPage = () => {
  const [isClientSide, setIsClientSide] = useState<boolean>(false)
  const { data: sessionData } = useSession()
  const router = useRouter()

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  if (!isClientSide || sessionData === undefined) return <div />

  if (sessionData === null) {
    return (
      <>
        <div>You are not connected</div>
        <Button
          onClick={() => router.push("/")}
        >
          Take me back home
        </Button>
      </>
    )
  }

  return (
    <div className="container">
      This is the editor page
      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  );
};

export default Editor;