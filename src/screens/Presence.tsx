import Link from "@components/Link";
import { NextSeo } from "next-seo";

import PageWrapper from "../components/PageWrapper";

const Presence = () => (
  <PageWrapper forceReadableWidth>
    <NextSeo
      title={"Real-time activity tracking with Discord integration"}
      description={
        "Learn about how I share real-time activities on this website using Lanyard integration with Discord's presence system."
      }
    />

    <h1>{"👀 Presence"}</h1>
    <p>
      {
        "You may have noticed that while I'm doing something like listening to Spotify, programming in VSCode or playing a game, it'll appear in the bottom left of my site. This is thanks to an open-source project called "
      }
      <Link href={"https://github.com/phineas/lanyard"}>{"Lanyard"}</Link>
      {
        " which pulls live presences from Discord and updates an API and WebSocket service. It takes <10 seconds to set up, you just have to join a Discord server!"
      }
    </p>
  </PageWrapper>
);

export default Presence;
