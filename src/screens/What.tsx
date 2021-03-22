import Head from 'next/head';

import Link from "@components/Link";
import PageWrapper from "@components/PageWrapper";

const Home = () => {
  return (
    <PageWrapper forceReadableWidth>
      <Head>
        <title>What I Do | Antoine Kingue</title>
      </Head>
      <h1>🤔 What I Do</h1>
      <p>20 y/o developer, designer and youtuber.</p>
      <p>
        I design, build and publish project of quality and reliability.
        Currently, I'm director and developer at{" "}<Link href="https://onruntime.com">onRuntime</Link>.
      </p>
      <p>I also make music as a DJ and post slow motion music on my Youtube Channel and by the way I love bringing people together to create and have fun together! 🥳</p>
    </PageWrapper>
  );
};

export default Home;
