import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { AuthBody } from "~/client/components/Auth";
import LandingLayout from "~/client/layouts/Landing";

 const Auth: NextPage = () => {
  return (
    <LandingLayout>
      <Head>
        <title>Authenticate / Real Me</title>
      </Head>
      <AuthBody />
    </LandingLayout>
  );
};

export default Auth;