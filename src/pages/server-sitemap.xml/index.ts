// pages/server-sitemap.xml/index.tsx
import { env } from "env.mjs";
import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";
import { YOUTUBE } from "src/constants/youtube";

const maxResults = 50;

async function fetchVideos(pageToken?: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${
      YOUTUBE.PLAYLIST_ID
    }${pageToken ? `&pageToken=${pageToken}` : ""}`,
  );
  const data = await response.json();
  return {
    videos: data.items,
    nextPageToken: data.nextPageToken,
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let pageToken = null;
  let allVideos = [];

  do {
    const { videos, nextPageToken } = await fetchVideos(pageToken);
    allVideos = [...allVideos, ...videos];
    pageToken = nextPageToken;
  } while (pageToken);

  const fields = allVideos.map((video) => ({
    loc: `${env.NEXT_PUBLIC_APP_URL}/videos/${video.snippet.resourceId.videoId}`,
    lastmod: new Date(video.snippet.publishedAt).toISOString(),
    // You can add more information like changefreq and priority if needed
  }));

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
