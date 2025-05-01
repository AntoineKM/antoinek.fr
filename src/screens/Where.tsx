import PageWrapper from "@components/PageWrapper";
import Co from "@components/Where/Co";
import Diplomas from "@components/Where/Diplomas";
import Repo from "@components/Where/Repo";
import { NextSeo } from "next-seo";

const Where = () => {
  return (
    <PageWrapper>
      <NextSeo
        title={"where I've done it | Antoine Kingue"}
        description={
          "Where I've worked, my diplomas and my open-source contributions."
        }
      />
      <h1>{"📍 where I've done it"}</h1>
      <Co />
      <Diplomas />
      <Repo />
    </PageWrapper>
  );
};

export default Where;
