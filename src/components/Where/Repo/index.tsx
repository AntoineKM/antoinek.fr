import Link from "@components/Link";
import React from "react";

const Repo: React.FC = () => {
  return (
    <>
      <h3>{"☕ Open-source Projects"}</h3>
      <p>
        <Link href={"https://github.com/AntoineKM"}>
          {"See all my contributions to the open source"}
        </Link>
      </p>
    </>
  );
};

export default Repo;
