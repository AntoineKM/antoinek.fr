import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import styled from "styled-components";

const ArkiAuth: React.FC = () => {
  const handleSuccess = (response) => {
    console.log(response);
  };

  return (
    <>
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
