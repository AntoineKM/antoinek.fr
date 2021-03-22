import Head from 'next/head';
import styled from "styled-components";

import PageWrapper from "@components/PageWrapper";
import Co from "@components/Co";
import Repo from "@components/Repo";

const onRuntimeIcon = '@assets/images/onruntime-icon.png' as string;
const NFactoryIcon = '@assets/images/nfactoryschool-icon.png' as string;
const AirFranceIcon = '@assets/images/airfrance-icon.png' as string;

const Where = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Where I've Done It | Antoine Kingue</title>
      </Head>
      <h1>📍 Where I've Done It</h1>
      <h3>🏢 Companies</h3>
      <CoWrapper>
        <Co url="https://nfactory.school/" name="NFactory School" iconReference={NFactoryIcon} tagline="Digital school" role="Student & Developer" what="I decided to join this school to learn good practices, create a network of developers and acquire a diploma that confirms my skills." />
        <Co url="https://onruntime.com/" name="onRuntime" iconReference={onRuntimeIcon} tagline="Development studio" role="Director & Developer" what="I founded onRuntime in 2019 to brings projects and teams of creators togethers." />
        <Co url="https://wwws.airfrance.fr/" name="Air France" iconReference={AirFranceIcon} tagline="Airline company" role="Trainee" what="I discovered the IT sector of Air France at Orly, where I was able to study and analyze the network and participate in meetings to implement new technologies on board the company's planes." />
      </CoWrapper>

      <h3>☕ Open-source Projects</h3>
      <Repo name="UberSitter" url="https://github.com/nfactoryschool-2020/nfactory-ubersitter" primaryLanguage="TypeScript" description="UberSitter is a project as part of an NFactory School training course which consists of developing a web solution allowing, on the one hand, childcare professionals to offer their services and, on the other hand, to parents looking for a one-off or regular care solution for their children." />
      <Repo name="onRuntime Website" url="https://github.com/onRuntime/onruntime-website" primaryLanguage="TypeScript" description="onRuntime official website." />
      <Repo name="Curricase" url="https://github.com/nfactoryschool-2020/nfactory-curricase" primaryLanguage="PHP" description="Curricase is a project as part of an NFactory School training course which consists of developing a CV management site." />
      <Repo name="getSnapchat" url="https://github.com/onRuntime/getsnapchat" primaryLanguage="TypeScript" description="getSnapchat is a cool tool for snapchaters to download stories of famous peoples." />
      <Repo name="Netron" url="https://github.com/nfactoryschool-2020/nfactory-netron" primaryLanguage="PHP" description="Netron is a project as part of an NFactory School training course which consists of developing a showcase site representing a company specializing in network analysis." />
      <Repo name="Bookination" url="https://github.com/nfactoryschool-2020/nfactory-bookination" primaryLanguage="PHP" description="Bookination is a project as part of an NFactory School training course which consists of developing a web solution that allows patients to fill in their vaccination records." />
      <Repo name="Instagram Dark Extension" url="https://github.com/onRuntime/instagram-dark-extension" primaryLanguage="JavaScript" description="Instagram dark extension is an extension which aims to change the theme of the Instagram website, and make it a dark theme like the iOS app when the system is in dark mode." />
      <Repo name="Twitter Smooth Extension" url="https://github.com/onRuntime/twitter-smooth-extensionn" primaryLanguage="CSS" description="Twitter smooth extension is an extension which aims to change the theme of the Twitter website, and make it a smooth theme." />
      <Repo name="Clock App" url="https://github.com/onRuntime/clock-app" primaryLanguage="JavaScript" description="Clock App is a basic React Native App made with Expo based on a dribbble design template." />
      <Repo name="onRuntime Website (Old)" url="https://github.com/onRuntime/onruntime-website-old" primaryLanguage="PHP" description="onRuntime official website." />

      <Repo name="BerryGames Website (React)" url="https://github.com/onRuntime/berrygames-website-react" primaryLanguage="Java" description="New BerryGames official website." />
      <Repo name="BerryGames Hub" url="https://github.com/onRuntime/berrygames-hub" primaryLanguage="Java" description="Hosts players on hub servers" />
      <Repo name="BerryGames Skyberry" url="https://github.com/onRuntime/berrygames-skyberry" primaryLanguage="Java" description="Skyberry is the new Spigot Server API plugin of BerryGames." />
      <Repo name="BerryGames Cloudberry" url="https://github.com/onRuntime/berrygames-cloudberry" primaryLanguage="Java" description="Cloudberry is the Spigot Server API plugin of BerryGames." />
      <Repo name="BerryGames Gooseberry" url="https://github.com/onRuntime/berrygames-gooseberry" primaryLanguage="Java" description="Gooseberry is the main Bungee Server plugin of BerryGames." />
      <Repo name="BerryGames Cloudberry" url="https://github.com/onRuntime/berrygames-cloudberry" primaryLanguage="Java" description="Cloudberry is the Spigot Server API plugin of BerryGames." />
      <Repo name="BerryGames WitchRush" url="https://github.com/onRuntime/berrygames-strawberry" primaryLanguage="Go" description="Strawberry is the REST API of BerryGames." />
      <Repo name="BerryGames Website" url="https://github.com/onRuntime/berrygames-website" primaryLanguage="PHP" description="BerryGames official website." />
      <Repo name="BerryGames WitchRush" url="https://github.com/onRuntime/berrygames-witchrush" primaryLanguage="Java" description="WitchRush is a minecraft minigame plugin." />

      <Repo name="FaruGames Buildbattle" url="https://github.com/onRuntime/farugames-discord-bot" primaryLanguage="Java" description="FaruGames Discord bot." />
      <Repo name="FaruGames API" url="https://github.com/onRuntime/farugames-api" primaryLanguage="Java" description="FaruGames API is the project containing the API used on the game servers." />
      <Repo name="FaruGames Data" url="https://github.com/onRuntime/farugames-data" primaryLanguage="Java" description="FaruGames Data is the project containing the storage API used on game servers and by players." />
      <Repo name="FaruGames Tryhard" url="https://github.com/onRuntime/farugames-tryhard" primaryLanguage="Java" description="FaruGames Tryhard is the project where players have to fight to be the last survivor." />
      <Repo name="FaruGames Hub" url="https://github.com/onRuntime/farugames-hub" primaryLanguage="Java" description="FaruGames Hub is the project that hosts players on hub servers." />
      <Repo name="FaruGames ServerManager" url="https://github.com/onRuntime/farugames-servermanager" primaryLanguage="Java" description="FaruGames ServerManager is an on-demand server system." />
      <Repo name="FaruGames Buildbattle" url="https://github.com/onRuntime/farugames-buildbattle" primaryLanguage="Java" description="Buildbattle is the project where players have to build their best buildings in a given time." />
    </PageWrapper>
  )
}

const CoWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 2rem 2rem;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export default Where;