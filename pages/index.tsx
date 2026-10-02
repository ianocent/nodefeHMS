import Seo from "../components/common/seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import Crm from "../components/pages/dashboards/crm";
import Head from "next/head";

const HomePage = () => {
  return (
    <>
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <Crm />
    </>
  );
};

export default HomePage;
