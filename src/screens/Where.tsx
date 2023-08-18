import PageWrapper from "@components/PageWrapper";
import Co from "@components/Where/Co";
import Repo from "@components/Where/Repo";
import Head from "next/head";

const Where = () => {
  return (
    <PageWrapper>
      <Head>
        <title>{"where I've done it | Antoine Kingue"}</title>
      </Head>
      <h1>{"📍 where I've done it"}</h1>
      <Co />
      <Repo />
    </PageWrapper>
  );
};

export default Where;
