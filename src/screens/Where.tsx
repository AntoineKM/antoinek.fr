import PageWrapper from "@components/PageWrapper";
import Co from "@components/Where/Co";
import Diplomas from "@components/Where/Diplomas";
import Repo from "@components/Where/Repo";
import Head from "next/head";

const Where = () => {
  return (
    <PageWrapper>
      <Head>
        <title>{"where I've done it | Antoine Kingue"}</title>
        <meta
          name={"description"}
          content={
            "Where I've worked, my diplomas and my open-source contributions."
          }
        />
      </Head>
      <h1>{"📍 where I've done it"}</h1>
      <Co />
      <Diplomas />
      <Repo />
    </PageWrapper>
  );
};

export default Where;
