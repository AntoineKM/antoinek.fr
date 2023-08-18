import NextHead from "next/head";

const Head = () => (
  <NextHead>
    <meta charSet={"utf-8"} />
    <link rel={"icon"} href={"/static/images/favicons/favicon.ico"} />
    <meta name={"viewport"} content={"width=device-width, initial-scale=1"} />
    <meta name={"theme-color"} content={"#10100e000"} />
    <meta
      name={"description"}
      content={"Antoine Kingue: developer, designer and youtuber"}
    />
    <link
      rel={"apple-touch-icon"}
      href={"/static/images/favicons/favicon.png"}
    />
    <link rel={"canonical"} href={"https://antoinek.fr/"} />
    {/* add open graph */}
    <meta property={"og:image"} content={"/static/images/open-graph.jpg"} />
    {/* add twitter */}
    <meta name={"twitter:card"} content={"summary_large_image"} />
    <meta name={"twitter:site"} content={"@AntoineKingue"} />
    <meta name={"twitter:creator"} content={"@AntoineKingue"} />
    <meta name={"twitter:image"} content={"/static/images/open-graph.jpg"} />

    <title>{"Antoine Kingue"}</title>
  </NextHead>
);

export default Head;
