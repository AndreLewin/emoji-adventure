import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { MantineProvider } from '@mantine/core';

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>

      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
          }}
        >

          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>

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
