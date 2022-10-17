import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ExploreBody } from "~/client/components/Explore";
import { RealInfo } from "~/client/components/Explore/RealInfo";
import ExploreLayout from "~/client/layouts/Explore";

const ExploreHomePage: NextPage = () => {
  return (
    <ExploreLayout>
      <Head>
        <title>Start exploring / Real Me</title>
      </Head>
      <RealInfo />
      <ExploreBody />
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

export default ExploreHomePage;
