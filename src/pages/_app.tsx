import { type AppProps } from 'next/app';
import Layout from "@/components/layout/Layout";
import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps<{ session?: any }>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default MyApp;