import Link from "@components/Link";
import { motion, PanInfo } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import { doingAtom } from "src/states/lanyard";
import styled from "styled-components";
import useSound from "use-sound";

import Doing from "./Doing";
import {
  GitHubLogo,
  LinkedinLogo,
  MenuIcon,
  NavigationIcon,
  TwitterLogo,
  XIcon,
} from "./Icons";

const pathnameOffsets: { [key: string]: number } = {
  "/": 0,
  "/where": 42,
  "/how": 84,
  "/videos": 126,
  "/etc": 168,
};

const Nav = () => {
  const router = useRouter();
  const { pathname } = useRouter();

  const [playSwitchPageSound] = useSound("/static/sounds/switch-page.mp3");

  const [dragYOffset, setDragYOffset] = useState(0);
  const [openOnMobile, setOpenOnMobile] = useState(true);
  const [presenceActive, setPresenceActive] = useState(false);

  const [doing] = useAtom(doingAtom);

  const dragConstraintsRef = useRef(null);

  useEffect(() => {
    if (openOnMobile) setOpenOnMobile(false);
    playSwitchPageSound();
  }, [pathname]);

  const pageIndicatorOffset = useMemo(
    () => (pathname ? pathnameOffsets[pathname] ?? -180 : 0),
    [pathname],
  );

  const pageIndicatorOffsetWithDecoration = useMemo(
    () => 71 + 36 + pageIndicatorOffset - dragYOffset,
    [pageIndicatorOffset, dragYOffset],
  );

  const onPageIndicatorDragEnd = useCallback(
    (_event, info: PanInfo) => {
      const goal = pageIndicatorOffset + info.offset.y;

      const closest = Object.entries(pathnameOffsets).reduce(
        ([prevPath, prevOffset], [curPath, curOffset]) => {
          return Math.abs(curOffset - goal) < Math.abs(prevOffset - goal)
            ? [curPath, curOffset]
            : [prevPath, prevOffset];
        },
      );

      if (closest[0] === pathname) return;

      setDragYOffset(dragYOffset + info.offset.y + info.velocity.y);
      router.push(closest[0]);
    },
    [router, pageIndicatorOffset, dragYOffset, pathname],
  );

  const toggleMobileMenu = useCallback(() => {
    setOpenOnMobile(!openOnMobile);
  }, [openOnMobile]);

  return (
    <>
      <MobileHeader>
        <Title>{"Antoine Kingue"}</Title>
        {openOnMobile ? (
          <XIcon onClick={toggleMobileMenu} />
        ) : (
          <MenuIcon onClick={toggleMobileMenu} />
        )}
      </MobileHeader>
      <Container openOnMobile={openOnMobile}>
        {!openOnMobile ? (
          <PageIndicator
            whileHover={{ width: 3 }}
            drag={"y"}
            onDragEnd={onPageIndicatorDragEnd}
            dragConstraints={dragConstraintsRef}
            animate={{ top: pageIndicatorOffsetWithDecoration }}
          />
        ) : null}
        <Items>
          {!openOnMobile ? (
            <Row>
              <Title>{"Antoine Kingue"}</Title>
              {/* <IconButton>
              <ChevronDown />
            </IconButton> */}
            </Row>
          ) : null}{" "}
          <Row>
            <Location
              href={
                doing
                  ? `https://google.com/maps/search/${encodeURIComponent(
                      doing.kv.location,
                    )}`
                  : "#"
              }
            >
              <NavigationIcon />
              {doing?.kv.location ? (
                doing.kv.location
              ) : (
                <ContentLoader
                  speed={2}
                  // width={"auto"}
                  height={19}
                  viewBox={"0 0 160 25"}
                  backgroundColor={"#121212"}
                  foregroundColor={"#2e2e2e"}
                >
                  <rect
                    x={"0"}
                    y={"3"}
                    rx={"6"}
                    ry={"6"}
                    width={"160"}
                    height={"19"}
                  />
                </ContentLoader>
              )}
            </Location>
          </Row>
          <div ref={dragConstraintsRef}>
            <Page active={pathname === "/"} href={"/"}>
              {"what I do"}
            </Page>
            <Page active={pathname === "/where"} href={"/where"}>
              {"where I've done it"}
            </Page>
            <Page active={pathname === "/how"} href={"/how"}>
              {"how I do it"}
            </Page>
            <Page active={pathname === "/videos"} href={"/videos"}>
              {"videos"}
            </Page>
            <Page active={pathname === "/etc"} href={"/etc"}>
              {"more + contact"}
            </Page>
          </div>
          <Icons>
            <Link
              aria-label={"LinkedIn - @antoinekm"}
              href={"https://linkedin.com/in/antoinekm/"}
            >
              <LinkedinLogo />
            </Link>
            <Link
              aria-label={"GitHub - @AntoineKM"}
              href={"https://github.com/AntoineKM"}
            >
              <GitHubLogo />
            </Link>
            <Link
              aria-label={"Twitter - @AntoineKingue"}
              href={"https://twitter.com/AntoineKingue"}
            >
              <TwitterLogo />
            </Link>
          </Icons>
          <Doing
            style={{ display: presenceActive ? "block" : "none" }}
            setActive={setPresenceActive}
          />
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
  border-right: 1px solid #30302b;
  height: 100vh;

  @media (max-width: 850px) {
    display: ${({ openOnMobile }) => (openOnMobile ? "block" : "none")};
    background-color: rgba(48, 48, 43, 0.8);
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
  position: fixed;
  top: 0;
  display: flex;
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
  height: 65px;
  background-color: rgba(48, 48, 43, 0.8);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #30302b;
  flex-shrink: 0;
  z-index: 1;

  svg {
    margin-left: auto;
    cursor: pointer;
    color: #606055;
  }

  @media (min-width: 850px) {
    display: none;
  }
`;

const PageIndicator = styled(motion.div)`
  width: 1px;
  height: 42px;
  background-color: #ffffe3;
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

const Location = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: 500;
  height: 19px;
  font-size: 14px;
  margin-bottom: 15px;
  user-select: none;

  color: rgba(255, 255, 227, 1);

  &:hover {
    color: rgba(255, 255, 227, 0.8);
  }

  svg:first-child {
    height: 18px;
    width: 18px;
    margin-right: 10px;
    color: #ffffe3;
  }
`;

const Page = styled(Link)<{ active: boolean }>`
  color: ${({ active }) => (active ? "#ffffe3" : "#606055")};
  padding: 10px 0px;
  display: flex;

  &:hover {
    /* background-color: #ffffe3; */
    color: #ffffe3;
  }
`;

const Icons = styled.div`
  margin-top: auto;
  color: #606055;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem 0;

  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #606055;

    &:hover {
      color: #ffffe3;
    }
  }
`;

export default Nav;
