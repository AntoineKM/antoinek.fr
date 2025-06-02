import { env } from "env.mjs";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const enpoint = "https://www.googleapis.com/youtube/v3/commentThreads";
  const url = urlcat(enpoint, {
    videoId: searchParams.get("videoId"),
    part: searchParams.get("part") || "snippet",
    key: env.YOUTUBE_API_KEY,
  });
  const response = await fetch(url);
  const data = await response.json();

  if (
    data &&
    data?.items?.length > 0 &&
    data?.items[0]?.snippet.channelId !== YOUTUBE.CHANNEL_ID
  ) {
    return NextResponse.json({
      message: `${data.items[0].snippet.channelId} is not allowed to use this api`,
    }, { status: 404 });
  }

  return NextResponse.json(data);
}
