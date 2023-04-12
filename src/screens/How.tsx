import Head from "next/head";

import PageWrapper from "../components/PageWrapper";
import Technology from "../components/Technology";
import {
  ReactLogo,
  SymfonyLogo,
  TypescriptLogo,
  GoLangLogo,
  GraphQLLogo,
  LaravelLogo,
  PythonLogo,
  FastifyLogo,
  NextLogo,
} from "../components/Icons";
import { technologies } from "src/data/technologies";

const How = () => {
  return (
    <PageWrapper>
      <Head>
        <title>how I do it | Antoine Kingue</title>
      </Head>
      <h1>💻 how I do it</h1>
      <p>
        I highly leverage new bleeding-edge technologies and languages like
        Typescript or Go to stay on top of the game. You can find a list of my
        most-used technologies below.
      </p>

      {/* <Technology
        color="#9c1fa5"
        icon={<ElixirLogo/>}
        name="Elixir"
        type="Realtime, Backend"
        useCase={
          "Building fault-tolerant realtime systems that scale out across multiple nodes"
        }
      /> */}

      {/* <Technology
        color="#dea584"
        icon={<RustLogo />}
        name="Rust"
        type="Backend, System"
        useCase={
          "Optimizing parts of Elixir code using Rust NIFs and writing efficient system code."
        }
      /> */}

      {/* <Technology
        color="#FF6600"
        icon={<RabbitMQLogo/>}
        name="RabbitMQ"
        type="Message queue"
        useCase={
          "Messaging between different services in a robust & durable way"
        }
      /> */}

      {technologies.map(({ color, icon: Icon, name, type, useCase }, i) => (
        <Technology
          key={i}
          color={color}
          icon={<Icon />}
          name={name}
          type={type}
          useCase={useCase}
        />
      ))}
    </PageWrapper>
  );
};

export default How;
