import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { SettingsBody } from "~/client/components/Settings";
import ExploreLayout from "~/client/layouts/Explore";

const PersonalSettingsPage: NextPage = () => {
  return (
    <ExploreLayout>
      <Head>
        <title>Settings / Real Me</title>
      </Head>
      <SettingsBody />
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

export default PersonalSettingsPage;
