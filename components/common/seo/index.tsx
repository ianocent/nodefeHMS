import React from "react";
import Head from "next/head";
import favicon from "../../../public/favicon.ico";
interface SeoProps {
  title: string;
}
const Seo = (props: SeoProps) => {
  const { title } = props;

  let i = `ANYAMAN - HMS ${title}`;

  return (
    <Head>
      <title>{i}</title>
      <link href={favicon.src} rel="icon"></link>
      <meta
        name="description"
        content="ANYAMAN - HMS Admin &amp; Dashboard Template"
      />
      <meta name="author" content="Dipstrategy.co.id" />
      <meta
        name="keywords"
        content="ANYAMAN - HMS Dipstrategy, CMS dipstrategy, Cms admin, Dipstrategy Cms, Cms Powerfull, admin dashboard Cms, tailwind dashboards, tailwind template admin, tailwind and nextjs, admin panel, template dashboard, admin dashboard template, admin panel template"
      ></meta>
    </Head>
  );
};

export default Seo;
