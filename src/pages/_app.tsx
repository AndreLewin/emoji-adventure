import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from "@mantine/notifications";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { useEffect, useState } from "react";
import store, { pushToGridHistory } from "../store";
import "animate.css";
import PromptModal from "../components/modals/PromptModal";
import AlertModal from "../components/modals/AlertModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import MultipleChoiceModal from "../components/modals/MultipleChoiceModal";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isClientSide, setIsClientSide] = useState<boolean>(false)

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  return (
    <>
      <Head>
        <title>Emoji Adventure</title>
        <meta content="Create your own interactive adventure" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😀</text></svg>" />
      </Head>

      {!isClientSide ? null :
        <SessionProvider session={session}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: 'light',
            }}
          >
            <ModalsProvider modals={{ alertModal: AlertModal, confirmModal: ConfirmModal, multipleChoiceModal: MultipleChoiceModal, promptModal: PromptModal }}>
              <NotificationsProvider>
                <Component {...pageProps} />
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </SessionProvider>
      }

      <style jsx global>
        {`
          :root {
            --highlighter-blue: rgb(0, 120, 215) 
          }
        `}
      </style>
    </>
  );
};

export default trpc.withTRPC(MyApp);
