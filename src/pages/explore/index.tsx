import type { GetServerSideProps, NextPage } from "next";

const ExploreHomePage: NextPage = () => {
  return <div>This will be the home page</div>;
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
