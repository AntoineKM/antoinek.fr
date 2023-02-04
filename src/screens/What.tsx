import Head from "next/head";

import Link from "@onruntime/next-link";
import PageWrapper from "@components/PageWrapper";

const Home = () => {
  return (
    <PageWrapper forceReadableWidth>
      <Head>
        <title>{"what I do | Antoine Kingue"}</title>
      </Head>
      <h1>{"🤔 what I do"}</h1>
      <p>{"Antoine, 21 y/o developer, designer and youtuber."}</p>
      <p>
        {
          "I design, build and publish projects of quality and reliability. Currently, I'm working on "
        }
        <Link href="https://tonightpass.com">{"Tonight Pass"}</Link>
        {"."}
      </p>
      <p>
        {
          "I'm specialized in reverse engineering, I study the way a platform is made to exploit the flaws of those in my own interest."
        }
      </p>
      <p>
        {
          "In my free time, I make music as a DJ and post slow motion music on my Youtube Channel and by the way I love bringing people together to create and have fun together! 🥳"
        }
      </p>
      <h3>A note about reverse engineering</h3>
      <p>
        {
          "I visit a lot of websites every day, and it's always funny to see that humans mainly think that a feature will only be used for its purpose. I study the way the functionality is done, it allows me to evolve by learning different ways of doing things, and then especially to automate our daily workflow, by creating bots or apis that interact like us or with which we can interact!"
        }
      </p>
      <h3>About Tonight Pass</h3>
      <p>
        {`I often go out to nightclubs and parties, and I have seen that this world is not very technologically advanced. Most companies only think about pre-selling tickets for events, but in reality the organization of a party is much more complex.
Tonight Pass simplifies the whole organization: find your teams and DJs, create your parties, promote and sell in presale or on the spot, pay in groups, provide self-service kiosks and reduce your queues, set up loyalty programs, at the end collect authentic reviews and allow your customers to stay in touch with each other and with you.`}
      </p>
      <p>
        {
          "All this is under construction and we should have our minimum viable product from June 2023, it is a challenge in therme of time and technologies used, because we also develop our own open source tools, but also an entrepreneurial challenge since we are young and invest a lot of our time and money in this project. Moreover until today we have not studied the possibility of raising funds to accelerate our development but we are open to anyone who would like to help us!"
        }
      </p>
    </PageWrapper>
  );
};

export default Home;
