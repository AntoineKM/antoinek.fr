import PageWrapper from "@components/PageWrapper";
import Co from "@components/Where/Co";
import Diplomas from "@components/Where/Diplomas";
import Repo from "@components/Where/Repo";
import { NextSeo } from "next-seo";
import compagnies from "src/data/compagnies";

const Where = () => {
  return (
    <PageWrapper>
      <NextSeo
        title={"Professional experience, companies & educational background"}
        description={
          `Explore my career journey, including work at ${compagnies[0].name}, ${compagnies[1].name}, and educational qualifications. View projects and professional certifications.`
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
