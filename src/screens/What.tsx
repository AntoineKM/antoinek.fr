import Link from "@components/Link";
import PageWrapper from "@components/PageWrapper";
import Head from "next/head";
import calculateAge from "src/utils/calculateAge";

const What = () => {
  return (
    <PageWrapper forceReadableWidth>
      <Head>
        <title>{"what I do | Antoine Kingue"}</title>
        <meta
          name={"description"}
          content={
            "Learn what Antoine Kingue does as a developer, designer and youtuber."
          }
        />
      </Head>
      <h1>{"🤔 what I do"}</h1>
      <p>{`Antoine, ${calculateAge(
        "2001-03-10",
      )} y/o developer, designer and youtuber.`}</p>
      <p>
        {
          "I design, build and publish projects of quality and reliability. Currently, I'm working at "
        }
        <Link href={"https://arkee.fr"}>{"Arkée"}</Link>
        {" and "}
        <Link href={"https://tonightpass.com"}>{"Tonight Pass"}</Link>
        {"."}
      </p>
      <p>
        {
          "In my free time, I make music as a DJ and post slow motion music on my Youtube Channel and by the way I love bringing people together to create and have fun together! 🥳"
        }
      </p>
      <h2>{"About Arkée by Jaws"}</h2>
      <p>
        {
          "SEO is a vast universe that I'd skimmed over during my Bachelor's degree in Web Development, so I really wanted to discover this field in more detail and create tools around it, which is why I joined Arkée."
        }
      </p>
      <p>
        {
          "I now wear two hats: that of a technical consultant, helping to resolve the various structural and performance problems encountered by our customers. And as a developer, I create tools that speed up the company's workflow."
        }
      </p>
      <h2>{"About Tonight Pass"}</h2>
      <p>
        {`I often go out to nightclubs and parties, and I have seen that this world is not very technologically advanced. Most companies only think about pre-selling tickets for events, but in reality the organization of a party is much more complex.
Tonight Pass simplifies the whole organization: find your teams and DJs, create your parties, promote and sell in presale or on the spot, pay in groups, provide self-service kiosks and reduce your queues, set up loyalty programs, at the end collect authentic reviews and allow your customers to stay in touch with each other and with you.`}
      </p>
      <p>
        {
          "All this is under construction and we should have our minimum viable product from August 2024, it is a challenge in therme of time and technologies used, because we also develop our own open source tools, but also an entrepreneurial challenge since we are young and invest a lot of our time and money in this project. Moreover until today we have not studied the possibility of raising funds to accelerate our development but we are open to anyone who would like to help us!"
        }
      </p>
    </PageWrapper>
  );
};

export default What;
