import { GoogleLogin } from "@react-oauth/google";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import urlcat from "urlcat";

const ArkiAuth: React.FC = () => {
  const handleSuccess = (response) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!response.hasOwnProperty("error")) {
      const link = document.createElement("a");
      link.href = urlcat("arki://auth", response);
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <>
      <Head>
        <meta name={"robots"} content={"noindex, nofollow"} />
      </Head>
      <Container>
        <GoogleLogin
          onSuccess={(response) => handleSuccess(response)}
          useOneTap
          shape={"circle"}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export default ArkiAuth;
