import React from "react";

export type Compagny = {
  name: string;
  type: string;
  role: string;
  description: string;
  url: string;
  image: string;
};

export type Technology = {
  color: string;
  icon: React.FC;
  name: string;
  type: string;
  useCase: string;
};
