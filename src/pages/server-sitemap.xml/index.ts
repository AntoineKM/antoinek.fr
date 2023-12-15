// pages/server-sitemap.xml/index.tsx
import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

const playListId = "UUN0hmDGaj1RAshd3A-x35pA";
const mykey = process.env.NEXT_PUBLIC_YOUTUBE_KEY || "";
const siteUrl = process.env.SITE_URL || "https://antoinek.fr";
const maxResults = 50;

async function fetchVideos(pageToken?: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playListId}&key=${mykey}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`,
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
    loc: `${siteUrl}/videos/${video.snippet.resourceId.videoId}`,
    lastmod: new Date(video.snippet.publishedAt).toISOString(),
    // You can add more information like changefreq and priority if needed
  }));

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
