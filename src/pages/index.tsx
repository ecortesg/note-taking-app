import { type NextPage } from "next";
import { AppPage } from "~/components/AppPage";
import { HomePage } from "~/components/HomePage";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();

  return <>{session.status !== "authenticated" ? <HomePage /> : <AppPage />}</>;
};

export default Home;
