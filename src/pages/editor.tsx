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
    router.push("/")
    return <div />
  }

  return (
    <div className="container">
      This is the editor page

      <Button>
        Create a new adventure
      </Button>

      <hr />
      Your adventures:
      {

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

export default Editor;