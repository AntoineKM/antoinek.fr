import PageWrapper from "@components/PageWrapper";
import Video from "@components/Video";
import VideoChannel from "@components/VideoChannel";
import VideoSkeleton from "@components/VideoSkeleton";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

export type VideosProps = {
  videos: any[];
};

const VideosPage: NextPage<VideosProps> = ({ videos }: VideosProps) => {
  return (
    <PageWrapper>
      <Head>
        <title>{"videos | Antoine Kingue"}</title>
      </Head>
      <h1>{"🎥 latest videos"}</h1>
      <VideosWrapper>
        {videos?.length > 1
          ? videos.map((video, i) => (
              <Video
                key={i}
                url={`https://youtu.be/${video.snippet.resourceId.videoId}`}
                title={video.snippet.title}
                thumbnailUrl={video.snippet.thumbnails.medium.url}
              />
            ))
          : Array.from({ length: 50 }, (_, i) => <VideoSkeleton key={i} />)}
        <VideoChannel
          title={"Visit my youtube channel to see more ➡️"}
          url={"https://youtube.com/@orionmood"}
        />
      </VideosWrapper>
    </PageWrapper>
  );
};

const VideosWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 2rem 2rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

VideosPage.getInitialProps = async (ctx: NextPageContext) => {
  const playListID = "UUN0hmDGaj1RAshd3A-x35pA";
  const mykey = process.env.NEXT_PUBLIC_YOUTUBE_KEY || "";
  const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=14&playlistId=${playListID}&key=${mykey}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    const videos = data.items;

    return { videos };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { videos: [] };
  }
};

export default VideosPage;
