import Link from "@onruntime/next-link";
import React from "react";

const Where: React.FC = () => {
  return (
    <>
      <h3>☕ Open-source Projects</h3>
      <Link href={"https://github.com/AntoineKM"}>
        {"See all my contributions to the open source"}
      </Link>
    </>
  );
};

export default Where;
