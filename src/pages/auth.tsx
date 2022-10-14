import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { AuthBody } from "~/client/components/Auth";

export const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>Auth</title>
      </Head>
      <AuthBody />
    </>
  );
};
