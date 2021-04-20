import { AppProps } from 'next/app'
import React from 'react';
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import { ChevronsRight } from '@components/Icons';
import SuccessiveType from '@components/SuccessiveType';
import Head from '@components/Head';
import Nav from '@components/Nav';

import '@styles/app.css'

const App = ({ Component, pageProps }: AppProps) => {

  const [introEnded, setIntroEnded] = React.useState(false);

  React.useEffect(() => {

    const onKeyDown = (e: React.KeyboardEvent<HTMLDocument> & any) => {
      if ((e.keyCode === 9 || e.which === 9) && !introEnded) {
        e.preventDefault();
      }
    };

    /*
    const script = document.createElement("script");
    script.src = "/p-static/js/stars.js";
    script.async = true;
    document.body.appendChild(script);
    */

    document.addEventListener('keydown', onKeyDown);
  }, [introEnded]);

  const onIntroEnd = React.useCallback(() => {
    localStorage.setItem("v1:intro-completed", "true");
    setIntroEnded(true);
  }, []);

  return (
    <>
      <Head />
      <Wrapper>
        <SuccessiveTypeContainer
          transition={{ duration: 0.85 }}
          animate={{ y: introEnded && process.browser ? -window.innerHeight : 0 }}
        >
          <ProgressContainer onClick={onIntroEnd}>
            <h4>Skip intro <ChevronsRight /></h4>
          </ProgressContainer>
          <SuccessiveType
            onEnd={onIntroEnd}
            words={
              "You will never regret what you have done, and you will always regret what you did not do, which is why I quickly design simple but effective projects for the future using a lot of new bleeding edge technologies and languages."
            }
            speed={1}
            userSkipped={introEnded}
          />
        </SuccessiveTypeContainer>

        <motion.video
          transition={{ duration: 0.85 }}
          animate={{ opacity: introEnded ? 0 : 0.25 }}
          src="/p-static/videos/background.mp4"
          autoPlay muted loop playsInline
        />
        <MainContent
          transition={{ duration: 0.85 }}
          initial={false}
          animate={{ y: !introEnded && process.browser ? window.innerHeight : 0 }}
        >
          <Nav />
          <ContentWrapper>
            <AnimatePresence>
              <Component {...pageProps} />
            </AnimatePresence>
          </ContentWrapper>
        </MainContent>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
  }

  video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    object-fit: cover;
  }
`;

const SuccessiveTypeContainer = styled(motion.div)`
  width: 65ch;
  height: 350px;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const ProgressContainer = styled.div`
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.2s ease;

  svg {
    vertical-align: middle;
    height: 19px;
  }

  &:hover {
    color: #ff7675;
  }
`;

const MainContent = styled(motion.div)`
  height: 100vh;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  overflow-y: auto;

  @media (max-width:850px) { 
    flex-direction: column;
    /* padding-top: 65px; */
  }
`;

const ContentWrapper = styled.div`
  margin-left: 15rem;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all .2s;

  a {
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width:850px)  { 
    margin-left: 0px;
    padding-top: 65px;
  }
`;

export default App
