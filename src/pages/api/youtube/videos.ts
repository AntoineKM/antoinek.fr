import { env } from "env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { YOUTUBE } from "src/constants/youtube";
import urlcat from "urlcat";

type ResponseData = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const enpoint = "https://www.googleapis.com/youtube/v3/videos";
  const url = urlcat(enpoint, {
    ...req.query,
    playlistId: YOUTUBE.PLAYLIST_ID,
    key: env.YOUTUBE_API_KEY,
    part: req.query.part || "snippet,statistics",
  });
  const response = await fetch(url);
  const data = await response.json();

  if (
    data &&
    data?.items?.length > 0 &&
    data?.items[0]?.snippet.channelId !== YOUTUBE.CHANNEL_ID
  ) {
    res.status(404).json({
      message: `${data.items[0].snippet.channelId} is not allowed to use this api`,
    });
    return;
  }

  res.status(200).json(data);
}
