import { env } from "env.mjs";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = Object.fromEntries(searchParams.entries());

  const endpoint = "https://www.googleapis.com/youtube/v3/playlistItems";
  const url = urlcat(endpoint, {
    ...query,
    playlistId: YOUTUBE.PLAYLIST_ID,
    key: env.YOUTUBE_API_KEY,
    part: query.part || "snippet",
    maxResults: query.maxResults || 12,
  });

  try {
    const response = await fetch(url);
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching YouTube playlist items:", error);
    return Response.json(
      { error: "Failed to fetch playlist items" },
      { status: 500 },
    );
  }
}
