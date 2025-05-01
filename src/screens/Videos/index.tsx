import PageWrapper from "@components/PageWrapper";
import Video from "@components/Video";
import VideoSkeleton from "@components/VideoSkeleton";
import { env } from "env.mjs";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

export type VideosProps = {
  videos: any[];
  nextPageToken: string;
  prevPageToken: string;
};

const VideosPage: NextPage<VideosProps> = ({
  videos,
  nextPageToken,
  prevPageToken,
}: VideosProps) => {
  return (
    <PageWrapper>
      <Head>
        <title>{"Creative video projects & youtube content"}</title>
        <meta
          name={"description"}
          content={
            "Watch my latest creative video content. Explore YouTube channel featuring music, slow motion videos, and digital creation."
          }
        />
      </Head>
      <h1>{"🎥 latest videos"}</h1>
      <VideosWrapper>
        {videos?.length > 1
          ? videos.map((video, i) => (
              <Video
                key={i}
                url={`/videos/${video.snippet.resourceId.videoId}`}
                title={video.snippet.title}
                thumbnailUrl={video.snippet.thumbnails.medium.url}
              />
            ))
          : Array.from({ length: 50 }, (_, i) => <VideoSkeleton key={i} />)}
      </VideosWrapper>
      <PaginationContainer>
        <PaginationButton
          href={`/videos${prevPageToken ? `?pageToken=${prevPageToken}` : ""}`}
          disabled={!prevPageToken}
          rel={"prev"}
        >
          {"⬅️ previous"}
        </PaginationButton>
        <PaginationButton
          href={`/videos${nextPageToken ? `?pageToken=${nextPageToken}` : ""}`}
          disabled={!nextPageToken}
          rel={"next"}
        >
          {"next ➡️"}
        </PaginationButton>
      </PaginationContainer>
    </PageWrapper>
  );
};

const VideosWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 2rem 2rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const PaginationButton = styled(Link)<{ disabled: boolean }>`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border: 1px solid #30302b;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  transition: all 0.1s ease;
  will-change: transform;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: #30302b;
    text-decoration: none !important;
  }

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    opacity: 0.5;
  `}
`;

VideosPage.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;

  const pageToken = (query.pageToken as string) || "";
  const playListId = "UUN0hmDGaj1RAshd3A-x35pA";
  const maxResults = 12;
  const url = `${env.NEXT_PUBLIC_APP_URL}/api/youtube/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playListId}&pageToken=${pageToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { nextPageToken, prevPageToken, items: videos } = data;

    return { videos, nextPageToken, prevPageToken };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { videos: [], nextPageToken: "", prevPageToken: "" };
  }
};

export default VideosPage;
