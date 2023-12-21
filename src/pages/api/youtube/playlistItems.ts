import { env } from "env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import urlcat from "urlcat";

type ResponseData = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const playlistId = "UUN0hmDGaj1RAshd3A-x35pA";
  const enpoint = "https://www.googleapis.com/youtube/v3/playlistItems";
  const url = urlcat(enpoint, {
    ...req.query,
    playlistId,
    key: env.YOUTUBE_API_KEY,
    part: req.query.part || "snippet",
    maxResults: req.query.maxResults || 12,
  });
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}
