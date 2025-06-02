import { env } from "env.mjs";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const enpoint = "https://www.googleapis.com/youtube/v3/playlistItems";
  const url = urlcat(enpoint, {
    playlistId: YOUTUBE.PLAYLIST_ID,
    key: env.YOUTUBE_API_KEY,
    part: searchParams.get("part") || "snippet",
    maxResults: searchParams.get("maxResults") || 12,
    pageToken: searchParams.get("pageToken") || "",
  });
  const response = await fetch(url);
  const data = await response.json();
  return NextResponse.json(data);
}
