import Link from "@components/Link";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { NAV_ITEMS } from "src/constants/nav-items";
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

const LOCATION_LOADER_ID = "location-loader";

const Nav = () => {
  const { pathname } = useRouter();

  const [playSwitchPageSound] = useSound("/static/sounds/switch-page.mp3");
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const [presenceActive, setPresenceActive] = useState(false);

  const [doing] = useAtom(doingAtom);

  useEffect(() => {
    setOpenOnMobile(false);
    playSwitchPageSound();
  }, [pathname, playSwitchPageSound]);

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
      <Container $openOnMobile={openOnMobile}>
        <Items>
          {!openOnMobile ? (
            <Row>
              <Title>{"Antoine Kingue"}</Title>
            </Row>
          ) : null}{" "}
          <Row>
            {doing?.kv.location && (
              <>
                <LocationIconWrapper>
                  <LocationIcon>
                    <NavigationIcon />
                  </LocationIcon>
                </LocationIconWrapper>
                {doing.kv.futureLocation ? (
                  <RelocationContainer>
                    <LocationLink
                      href={`https://google.com/maps/search/${encodeURIComponent(
                        doing.kv.location,
                      )}`}
                    >
                      {doing.kv.location}
                    </LocationLink>
                    <TransitionArrow>{"→"}</TransitionArrow>
                    <LocationLink
                      href={`https://google.com/maps/search/${encodeURIComponent(
                        doing.kv.futureLocation,
                      )}`}
                    >
                      {doing.kv.futureLocation}
                    </LocationLink>
                    <PulsingDot />
                  </RelocationContainer>
                ) : (
                  <Location
                    href={`https://google.com/maps/search/${encodeURIComponent(
                      doing.kv.location,
                    )}`}
                  >
                    {doing.kv.location}
                  </Location>
                )}
              </>
            )}
            {!doing?.kv.location && (
              <>
                <LocationIconWrapper>
                  <LocationIcon>
                    <NavigationIcon />
                  </LocationIcon>
                </LocationIconWrapper>
                <ContentLoader
                  speed={2}
                  height={19}
                  viewBox={"0 0 160 25"}
                  backgroundColor={"#121212"}
                  foregroundColor={"#2e2e2e"}
                  uniqueKey={LOCATION_LOADER_ID}
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
              </>
            )}
          </Row>
          <NavMenu>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.name} $active={pathname === item.href}>
                <Page href={item.href}>{item.name}</Page>
              </NavItem>
            ))}
          </NavMenu>
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
              aria-label={"X - @AntoineKingue"}
              href={"https://x.com/AntoineKingue"}
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

const Container = styled.aside<{ $openOnMobile: boolean }>`
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
  z-index: 10;

  @media (max-width: 850px) {
    display: ${({ $openOnMobile }) => ($openOnMobile ? "block" : "none")};
    background-color: rgba(48, 48, 43, 0.8);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    z-index: 10;
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
    color: #bdbdb2;
  }

  @media (min-width: 850px) {
    display: none;
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const NavItem = styled.div<{ $active: boolean }>`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: -2rem; /* Align with the right edge of the container */
    top: 50%;
    transform: translateY(-50%);
    width: ${({ $active }) => ($active ? "1px" : "0")};
    height: 42px;
    background-color: #ffffe3;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: ${({ $active }) => ($active ? "3px" : "0")};
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;

const Title = styled.div`
  font-weight: 600;
  padding: 10px 0px;
`;

const LocationIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LocationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  position: relative;
  width: 28px;
  height: 28px;

  &::before {
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: rgba(255, 255, 227, 0.05);
    border-radius: 50%;
    z-index: -1;
    transform: scale(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scale(1);
  }

  svg {
    height: 18px;
    width: 18px;
    color: #ffffe3;
  }
`;

const RelocationContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 19px;
  font-size: 14px;
`;

const TransitionArrow = styled.span`
  color: #bdbdb2;
  font-size: 14px;
  transition: transform 0.3s ease;
  will-change: transform;

  ${RelocationContainer}:hover & {
    color: #ffffe3;
    transform: translateX(2px);
  }
`;

const LocationLink = styled(Link)`
  color: rgba(255, 255, 227, 1);
  text-decoration: none;
  font-weight: 500;
  position: relative;

  &:hover {
    color: rgba(255, 255, 227, 0.8);
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: rgba(255, 255, 227, 0.8);
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const Location = styled(Link)`
  color: rgba(255, 255, 227, 1);
  text-decoration: none;
  font-weight: 500;
  height: 19px;
  font-size: 14px;
  position: relative;

  &:hover {
    color: rgba(255, 255, 227, 0.8);
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: rgba(255, 255, 227, 0.8);
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const PulsingDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffffe3;
  margin-left: 3px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 255, 227, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(255, 255, 227, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 255, 227, 0);
    }
  }
`;

const Page = styled(Link)`
  padding: 10px 0px;
  display: flex;
  color: inherit;

  &:hover {
    color: #ffffe3;
  }
`;

const Icons = styled.div`
  margin-top: auto;
  color: #bdbdb2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem 0;

  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #bdbdb2;

    &:hover {
      color: #ffffe3;
    }
  }
`;

export default Nav;
