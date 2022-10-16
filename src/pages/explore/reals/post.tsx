import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ExploreBody } from "~/client/components/Explore";
import { RealPostBody } from "~/client/components/Real/Post";
import ExploreLayout from "~/client/layouts/Explore";

const ExploreRealPostPage: NextPage = () => {
  return (
    <ExploreLayout>
      <Head>
        <title>Start exploring / Real Me</title>
      </Head>
      <RealPostBody />
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

export default ExploreRealPostPage;
