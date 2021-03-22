import { useRouter } from 'next/router'
import { motion, PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  GitHubLogo,
  LinkedinLogo,
  MenuIcon,
  XIcon,
} from "./Icons";
import Doing from "./Doing";
import useSound from "use-sound";
import Link from "./Link";

const pathnameOffsets: { [key: string]: number } = {
  "/": 0,
  "/where": 39,
  "/how": 78,
  "/etc": 117,
};

const Nav = () => {

  const router = useRouter();
  const { pathname } = useRouter();

  const [playSwitchPageSound] = useSound("/p-static/sounds/switch-page.mp3");

  const [dragYOffset, setDragYOffset] = useState(0);
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const [presenceActive, setPresenceActive] = useState(false);

  const dragConstraintsRef = useRef(null);

  useEffect(() => {
    if (openOnMobile) setOpenOnMobile(false);
    playSwitchPageSound();
  }, [pathname, openOnMobile, playSwitchPageSound]);

  const pageIndicatorOffset = useMemo(
    () => (pathname ? pathnameOffsets[pathname] ?? -120 : 0),
    [pathname]
  );

  const pageIndicatorOffsetWithDecoration = useMemo(
    () => 71 + pageIndicatorOffset - dragYOffset,
    [pageIndicatorOffset, dragYOffset]
  );

  const onPageIndicatorDragEnd = useCallback(
    (_event, info: PanInfo) => {
      const goal = pageIndicatorOffset + info.offset.y;

      const closest = Object.entries(pathnameOffsets).reduce(
        ([prevPath, prevOffset], [curPath, curOffset]) => {
          return Math.abs(curOffset - goal) < Math.abs(prevOffset - goal)
            ? [curPath, curOffset]
            : [prevPath, prevOffset];
        }
      );

      if (closest[0] === pathname) return;

      setDragYOffset(dragYOffset + info.offset.y + info.velocity.y);
      router.push(closest[0]);
    },
    [router, pageIndicatorOffset, dragYOffset, pathname]
  );

  const toggleMobileMenu = useCallback(() => setOpenOnMobile(!openOnMobile), [
    openOnMobile,
  ]);

  return (
    <>
      <MobileHeader>
        <Title>Antoine Kingue</Title>
        {openOnMobile ? <XIcon onClick={toggleMobileMenu} /> : <MenuIcon onClick={toggleMobileMenu} />}
      </MobileHeader>
      <Container openOnMobile={openOnMobile}>
        {!openOnMobile ? <PageIndicator
          whileHover={{ width: 3 }}
          drag="y"
          onDragEnd={onPageIndicatorDragEnd}
          dragConstraints={dragConstraintsRef}
          animate={{ top: pageIndicatorOffsetWithDecoration }}
        /> : null}
        <Items>
          {!openOnMobile ?
            <Row>
              <Title>Antoine Kingue</Title>
              {/* <IconButton>
              <ChevronDown />
            </IconButton> */}
            </Row> : null}
          <div ref={dragConstraintsRef}>
            <Page active={pathname === "/"} href="/">
              what I do
            </Page>
            <Page active={pathname === "/where"} href="/where">
              where I've done it
            </Page>
            <Page active={pathname === "/how"} href="/how">
              how I do it
            </Page>
            <Page active={pathname === "/etc"} href="/etc">
              more + contact
            </Page>
          </div>

          <Icons>
            <Link href="https://github.com/AntoineKM"><GitHubLogo /></Link>
            <Link href="https://linkedin.com/in/antoinekm/"><LinkedinLogo /></Link>
          </Icons>
          <Doing style={{ display: presenceActive ? 'block' : 'none' }} setActive={setPresenceActive} />
        </Items>
      </Container>
    </>
  );
};

const Container = styled.aside<{ openOnMobile: boolean }>`
  display: inline-block;
  box-sizing: border-box;
  flex-direction: column;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 15rem;
  border-right: 1px solid #101010;
  height: 100vh;

  @media (max-width: 850px) {
    display: ${({ openOnMobile }) => openOnMobile ? 'block' : 'none'};
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(7px);
    z-index: 1;
    top: 65px;
    width: 100%;
    height: calc(100% - 65px);
  }
`;

const MobileHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed ;
  top: 0;
  display: flex;
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
  height: 65px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #101010;
  flex-shrink: 0;
  z-index: 1;

  svg {
    margin-left: auto;
    cursor: pointer;
    color: #ccc;
  }

  @media (min-width: 850px) {
    display: none;
  }
`;

const PageIndicator = styled(motion.div)`
  width: 1px;
  height: 39px;
  background-color: #fff;
  position: absolute;
  right: -1px;
  cursor: pointer;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: 600;
  padding: 10px 0px;
`;

const Page = styled(Link) <{ active: boolean }>`
  color: ${({ active }) => (active ? "#fff" : "#ccc")};
  padding: 10px 0px;
  display: flex;

  &:hover {
    /* background-color: #fff; */
    color: #fff;
  }
`;

const Icons = styled.div`
  margin-top: auto;
  color: #ccc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem 0;

  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #ccc;

    &:hover {
      color: #fff;
    }
  }
`;

export default Nav;
