import type { GetServerSideProps, NextPage } from "next";
import ExploreLayout from "~/client/layouts/Explore";

const ExploreHomePage: NextPage = () => {

  return (
    <ExploreLayout>
      This will be the home page
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
