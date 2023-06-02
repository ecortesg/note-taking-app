import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { NavBar } from "~/components/NavBar";
import { Lato } from "next/font/google";

const lora = Lato({ subsets: ["latin"], weight: ["400", "700"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Lernote</title>
        <meta name="description" content="Note Taking App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`container mx-auto min-h-screen ${lora.className}`}>
        <NavBar />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
