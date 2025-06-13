import { env } from "env.mjs";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = Object.fromEntries(searchParams.entries());

  const endpoint = "https://www.googleapis.com/youtube/v3/commentThreads";
  const url = urlcat(endpoint, {
    ...query,
    key: env.YOUTUBE_API_KEY,
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
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching YouTube comment threads:", error);
    return Response.json(
      { error: "Failed to fetch comment threads" },
      { status: 500 },
    );
  }
}
