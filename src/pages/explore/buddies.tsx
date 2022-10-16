import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { BuddiesBody } from "~/client/components/Buddies";
import ExploreLayout from "~/client/layouts/Explore";

const BuddieseHomePage: NextPage = () => {
  return (
    <ExploreLayout>
      <Head>
        <title>My Buddies / Real Me</title>
      </Head>
      <BuddiesBody />
    </ExploreLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.access_token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default BuddieseHomePage;
