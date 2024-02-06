import { type AppType } from "next/app";
import Layout from "@/components/Layout";

import "scaffold/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
};

export default MyApp;
