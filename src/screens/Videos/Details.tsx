import PageWrapper from "@components/PageWrapper";
import { NextPage, NextPageContext } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

export type VideoDetailsProps = {
  videoId: string;
  details?: any;
  comments?: any[];
  statistics?: {
    commentCount: string;
    likeCount: string;
    viewCount: string;
    favoriteCount: string;
  };
  nextPageToken?: string;
  err?: {
    statusCode: number;
  };
};

const mykey = process.env.NEXT_PUBLIC_YOUTUBE_KEY || "";
const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "";

const VideoDetails: NextPage<VideoDetailsProps> = ({
  videoId,
  details,
  comments,
  statistics,
  nextPageToken,
  err,
}: VideoDetailsProps) => {
  const [currentNextPageToken, setCurrentNextPageToken] = React.useState<
    string | null
  >(nextPageToken || null);
  const [currentComments, setCurrentComments] = React.useState<any[]>(
    comments || [],
  );

  if (err) {
    return <ErrorPage statusCode={err.statusCode} />;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const descriptionWithBreaks = details?.description
    ?.split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  const loadMoreComments = async () => {
    console.log("nextPageToken", nextPageToken);
    if (nextPageToken) {
      const videoCommentsURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${mykey}&pageToken=${nextPageToken}&order=relevance`;

      try {
        const response = await fetch(videoCommentsURL);
        const data = await response.json();
        const newComments = data.items;

        if (!newComments) {
          throw new Error("No comments found");
        }

        setCurrentComments((prevComments) => [...prevComments, ...newComments]);
        setCurrentNextPageToken(data.nextPageToken || null);
      } catch (error) {
        console.error("Error fetching additional comments:", error);
      }
    }
  };

  return (
    <PageWrapper>
      <Head>
        <title>{details?.title}</title>
      </Head>
      <DetailsContainer>
        <VideoTitle>{details?.title}</VideoTitle>
        <VideoEmbedWrapper>
          {videoId && (
            <VideoEmbed
              width={"560"}
              height={"315"}
              src={`${embedUrl}?autoplay=1`}
              frameBorder={"0"}
              allowFullScreen
              allow={"autoplay"}
              title={"Embedded YouTube Player"}
            />
          )}
        </VideoEmbedWrapper>
        <VideoDescription>{descriptionWithBreaks}</VideoDescription>
        {currentComments && currentComments.length > 0 && (
          <CommentsContainer>
            <h2>{`${statistics?.commentCount} comments`}</h2>
            {currentComments.map((comment, index) => (
              <Comment key={index}>
                <CommenterLink
                  href={
                    comment.snippet.topLevelComment.snippet.authorChannelUrl
                  }
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                >
                  <CommenterAvatar
                    src={
                      comment.snippet.topLevelComment.snippet
                        .authorProfileImageUrl
                    }
                    alt={`${comment.snippet.topLevelComment.snippet.authorDisplayName}'s avatar`}
                  />
                  <strong>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                  </strong>
                </CommenterLink>
                {": "}
                {comment.snippet.topLevelComment.snippet.textOriginal}

                {comment.replies &&
                  comment.replies.comments.map((reply, replyIndex) => (
                    <Reply key={replyIndex} index={replyIndex}>
                      <CommenterLink
                        href={reply.snippet.authorChannelUrl}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                      >
                        <CommenterAvatar
                          src={reply.snippet.authorProfileImageUrl}
                          alt={`${reply.snippet.authorDisplayName}'s avatar`}
                        />
                        <strong>{reply.snippet.authorDisplayName}</strong>
                      </CommenterLink>
                      {": "}
                      {reply.snippet.textOriginal}
                    </Reply>
                  ))}
              </Comment>
            ))}
            {currentNextPageToken && (
              <LoadMoreButton onClick={loadMoreComments}>
                {"See More Comments"}
              </LoadMoreButton>
            )}
          </CommentsContainer>
        )}
      </DetailsContainer>
    </PageWrapper>
  );
};

const DetailsContainer = styled.div``;

const VideoTitle = styled.h1`
  margin-bottom: 20px;
`;

const VideoEmbedWrapper = styled.div`
  margin-bottom: 20px;
`;

const VideoEmbed = styled.iframe`
  width: 100%;
  max-width: 800px;
  height: 450px;
  border-radius: 10px;
`;

const VideoDescription = styled.p`
  max-width: 800px;
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  margin-bottom: 10px;
`;

const Reply = styled.div<{ index: number }>`
  position: relative;
  margin-left: 20px;
  margin-top: 10px;

  &::before {
    content: "";
    display: block;
    width: 10px;
    height: ${({ index }) => (index === 0 ? "21px" : "41px")};
    position: absolute;
    left: -11px;
    top: -${({ index }) => (index === 0 ? "10px" : "30px")};
    border-left: 2px solid #30302b;
    border-bottom: 2px solid #30302b;
    border-bottom-left-radius: 5px;
    z-index: -1;
  }
`;

const CommenterLink = styled.a``;

const CommenterAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
`;

const LoadMoreButton = styled.button`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border: 1px solid #30302b;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  transition: all 0.1s ease;
  will-change: transform;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 600;
  background: transparent;

  &:hover {
    background-color: #30302b;
  }
`;

VideoDetails.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  const videoId = query.id as string;
  const videoDetailsURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${mykey}`;
  const videoCommentsURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${mykey}&textFormat=html&order=relevance`;

  try {
    const response = await fetch(videoDetailsURL);
    const data = await response.json();
    const details = data.items[0]?.snippet;
    const statistics = data.items[0]?.statistics;

    const videoCommentsResponse = await fetch(videoCommentsURL);
    const videoCommentsData = await videoCommentsResponse.json();
    const comments = videoCommentsData.items;
    const nextPageToken = videoCommentsData.nextPageToken;

    if (!details) {
      throw new Error("No details found");
    }

    if (details.channelId !== channelId) {
      throw new Error("Video not found");
    }

    return { videoId, details, comments, statistics, nextPageToken };
  } catch (error) {
    console.error("Error fetching video details:", error);
    ctx.res.statusCode = 404;
    return {
      videoId,
      err: {
        statusCode: 404,
      },
    };
  }
};

export default VideoDetails;
