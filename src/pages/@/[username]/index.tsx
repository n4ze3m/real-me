import { Container } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { UserBody } from "~/client/components/User";
import ExploreLayout from "~/client/layouts/Explore";
import LandingLayout from "~/client/layouts/Landing";

const ExploreHomePage: NextPage = ({ auth }: any) => {
  if (auth) {
    return (
      <ExploreLayout>
        <Head>
          <title>Real Me</title>
        </Head>
        <UserBody />
      </ExploreLayout>
    );
  }
  return (
    <LandingLayout>
      <Head>
        <title>Real Me</title>
      </Head>
      <Container
        style={{
          marginTop: "3rem",
        }}
      >
        <UserBody />
      </Container>
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.access_token) {
    return {
      props: {
        auth: true,
      },
    };
  }

  return {
    props: {
      auth: false,
    },
  };
};

export default ExploreHomePage;
