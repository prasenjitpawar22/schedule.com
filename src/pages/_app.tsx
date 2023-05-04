import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { NextPage, NextPageContext } from "next";
import { ReactElement, ReactNode } from "react";
import "react-datepicker/dist/react-datepicker.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  const { session } = pageProps;

  const getLayout =
    (Component as NextPageWithLayout).getLayout ??
    ((page) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true} attribute="class">
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
