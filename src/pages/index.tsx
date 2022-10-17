import type { NextPage } from "next";
import Head from "next/head";
import { HomeBody } from "~/client/components/Home";
import LandingLayout from "~/client/layouts/Landing";

const Home: NextPage = () => {
  return (
    <LandingLayout>
      <Head>
        <title>Just Another Social Network / Real Me</title>
      </Head>
      <HomeBody />
    </LandingLayout>
  );
};

export default Home;
