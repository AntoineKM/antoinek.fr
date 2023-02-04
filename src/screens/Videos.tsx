import Head from "next/head";
import React from "react";
import styled from "styled-components";

import Video from "@components/Video";
import PageWrapper from "@components/PageWrapper";
import VideoSkeleton from "@components/VideoSkeleton";

const Presence = () => {
  const [videos, setVideos] = React.useState([]);
  const apiCall = React.useCallback((npt?: any) => {
    fetch(getUrl(npt))
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          responseHandler(response);
        }
      });
  }, []);

  React.useEffect(() => {
    apiCall();
  }, [apiCall]);

  const getUrl = (pagetoken) => {
    const pt =
        typeof pagetoken === "undefined" ? "" : `&pageToken=${pagetoken}`,
      mykey = "AIzaSyA3R6LsS3L7cYq1QyPvjyah_adg3zrSqXY",
      playListID = "UUN0hmDGaj1RAshd3A-x35pA",
      URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playListID}&key=${mykey}${pt}`;
    return URL;
  };

  const responseHandler = (response) => {
    //if (response.nextPageToken) apiCall(response.nextPageToken);

    setVideos(response.items);
    // console.log(response.items)
    // for (var item of response.items) {
    //      setVideos(prevState => [...prevState, item]);
    // }
    //console.log(videos);
  };

  return (
    <PageWrapper>
      <Head>
        <title>Videos | Antoine Kingue</title>
      </Head>
      <h1>🎥 latest videos</h1>
      <VideosWrapper>
        {videos?.length > 1
          ? videos.map((video, i) => (
              <Video
                key={i}
                url={`https://youtu.be/${video.snippet.resourceId.videoId}`}
                title={video.snippet.title}
                thumbnailUrl={video.snippet.thumbnails.medium.url}
              />
            ))
          : Array.from({ length: 50 }, (_, i) => <VideoSkeleton key={i} />)}
      </VideosWrapper>
    </PageWrapper>
  );
};

const VideosWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 2rem 2rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export default Presence;
