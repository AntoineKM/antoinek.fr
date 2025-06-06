import { useRouter } from "next/router";
import {
  DefaultSeo,
  LogoJsonLd,
  OrganizationJsonLd,
  SocialProfileJsonLd,
} from "next-seo";

const Head = () => {
  const router = useRouter();
  const websiteUrl = "https://antoinek.fr";
  const url = new URL(`${websiteUrl}${router.asPath}`);
  const params = new URLSearchParams(url.search);
  const pageToken = params.get("pageToken");

  url.hash = "";
  if (pageToken) {
    url.search = `?pageToken=${pageToken}`;
  } else {
    url.search = "";
  }

  return (
    <>
      <OrganizationJsonLd
        type={"Person"}
        logo={"https://antoinek.fr/static/images/favicons/favicon.png"}
        name={"Antoine Kingue"}
        url={websiteUrl}
        sameAs={[
          "https://linkedin.com/in/antoinekm",
          "https://github.com/AntoineKM",
          "https://x.com/AntoineKingue",
          "https://youtube.com/c/orionmood",
        ]}
      />

      <LogoJsonLd
        logo={"https://antoinek.fr/static/images/favicons/favicon.png"}
        url={websiteUrl}
      />

      <SocialProfileJsonLd
        type={"Person"}
        name={"Antoine Kingue"}
        url={websiteUrl}
        sameAs={[
          "https://linkedin.com/in/antoinekm",
          "https://github.com/AntoineKM",
          "https://x.com/AntoineKingue",
          "https://youtube.com/c/orionmood",
        ]}
      />

      <DefaultSeo
        title={"Antoine Kingue"}
        description={"Antoine Kingue: developer, designer and youtuber"}
        canonical={url.href}
        openGraph={{
          type: "website",
          locale: "en_US",
          url: url.href,
          site_name: "Antoine Kingue",
          images: [
            {
              url: "/static/images/open-graph.jpg",
              width: 1500,
              height: 500,
              alt: "Antoine Kingue",
            },
          ],
        }}
        twitter={{
          handle: "@AntoineKingue",
          site: "@AntoineKingue",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "theme-color",
            content: "#10100e",
          },
          {
            name: "viewport",
            content:
              "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/static/images/favicons/favicon.ico",
          },
          {
            rel: "apple-touch-icon",
            href: "/static/images/favicons/favicon.png",
          },
        ]}
        titleTemplate={"%s | Antoine Kingue"}
      />
    </>
  );
};

export default Head;
