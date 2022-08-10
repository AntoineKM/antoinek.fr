import React from "react";
import Image from "next/image";

import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

import Progress from "./Progress";
import Link from "./Link";

import SpotifyLogo from "../assets/images/spotify-logo.svg";

const Doing = (
  { setActive, ...props }: { setActive: (active: boolean) => void } & any,
  ref: any
) => {
  const [doing, setDoing] = React.useState<any | null>(null);

  React.useEffect(() => {
    const queryLanyard = async () => {
      const body = await fetch(
        "https://api.lanyard.rest/v1/users/623154662765232128"
      ).then((res) => res.json());

      if (body.success) {
        setDoing(body.data);

        setActive(doing?.listening_to_spotify || currentActivity);
      }
    };

    queryLanyard();

    setInterval(() => {
      queryLanyard();
    }, 1000);
  }, [setActive]);

  if (!doing || doing?.discord_status === "offline") return null;

  const currentActivity = doing?.activities.filter(
    (activity) => activity.type === 0
  )[0];
  const currentDate: any = new Date();

  const timeElapsed = (startTime: any) => {
    const formatIntDouble = (int: number) => {
      return int < 10 && int >= 0 ? "0" + int : int;
    };

    const endTime: any = currentDate;
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    const minutes = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    const hours = Math.round(timeDiff % 24);
    timeDiff = Math.floor(timeDiff / 24);
    const days = timeDiff;

    return `${days > 0 ? formatIntDouble(days) + ":" : ""}${
      hours > 0 ? formatIntDouble(hours) + ":" : ""
    }${formatIntDouble(minutes) + ":" + formatIntDouble(seconds)}`;
  };

  return (
    <>
      {doing?.listening_to_spotify ? (
        <Container ref={ref} href="/presence" {...props}>
          <h5>
            Listening to Spotify <LiveDot />
          </h5>

          <ActivityRow>
            <ActivityImageContainer>
              <ActivityImage
                src={doing.spotify.album_art_url}
                alt="Activity Image"
              />
              <ActivitySecondaryImage src={SpotifyLogo} alt="Spotify Logo" />
            </ActivityImageContainer>
            <ActivityInfo>
              <h5>{doing.spotify.song}</h5>
              <p>by {doing.spotify.artist}</p>
            </ActivityInfo>
          </ActivityRow>
          <Progress
            percentage={
              (100 * (currentDate - doing.spotify.timestamps.start)) /
              (doing.spotify.timestamps.end - doing.spotify.timestamps.start)
            }
          />
        </Container>
      ) : null}
      {currentActivity?.type === 0 ? (
        <Container ref={ref} href="/presence" {...props}>
          <h5>Doing something</h5>
          <ActivityRow>
            {currentActivity.assets ? (
              <ActivityImageContainer>
                {currentActivity.assets.large_image && (
                  <ActivityImage
                    src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.png`}
                    alt="Activity Image"
                  />
                )}
                {currentActivity.assets.small_image && (
                  <ActivitySecondaryImage
                    src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}.png`}
                    alt="ActivitySecondaryImage"
                  />
                )}
              </ActivityImageContainer>
            ) : null}
            <ActivityInfo>
              <h5>{currentActivity.name}</h5>
              {currentActivity.details ? (
                <p>{currentActivity.details}</p>
              ) : null}
              {currentActivity.state ? <p>{currentActivity.state}</p> : null}
              <p>{timeElapsed(currentActivity.created_at + -1000)} elapsed</p>
            </ActivityInfo>
          </ActivityRow>
        </Container>
      ) : null}
    </>
  );
};

const Container = styled(motion(Link))`
  width: calc(100% + 2rem);
  margin-left: -2rem;
  background-color: transparent;
  color: #ccc;
  border-top: 1px solid #101010;
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #101010;
    color: #fff;
  }

  h5 {
    margin: 0;
    margin-bottom: 10px;
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  
  50% {
    opacity: 1;
  }

  100% {
    opacity: 0%;
  }
`;

const LiveDot = styled.div`
  display: inline-block;
  margin-left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5252;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

const ActivityRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ActivityImageContainer = styled.div`
  position: relative;
  height: 50px;
  margin-right: 1rem;
`;

const ActivityImage = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 10px;
`;

const ActivitySecondaryImage = styled.img`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #000;
  border: 2px solid #000;
`;

const ActivityInfo = styled.div`
  h5 {
    color: #fff;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

export default React.forwardRef(Doing);
