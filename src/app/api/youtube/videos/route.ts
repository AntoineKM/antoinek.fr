import { env } from "env.mjs";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = Object.fromEntries(searchParams.entries());

  const endpoint = "https://www.googleapis.com/youtube/v3/videos";
  const url = urlcat(endpoint, {
    ...query,
    playlistId: YOUTUBE.PLAYLIST_ID,
    key: env.YOUTUBE_API_KEY,
    part: query.part || "snippet,statistics",
  });

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data &&
      data?.items?.length > 0 &&
      data?.items[0]?.snippet.channelId !== YOUTUBE.CHANNEL_ID
    ) {
      return Response.json(
        {
          message: `${data.items[0].snippet.channelId} is not allowed to use this api`,
        },
        { status: 404 },
      );
    } else if (data?.items?.length === 0) {
      return Response.json(
        {
          message: "No data found",
        },
        { status: 404 },
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
