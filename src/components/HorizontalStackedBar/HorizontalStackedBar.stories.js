import React from "react";
import HorizontalStackedBar from "./HorizontalStackedBar";
import { number, withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Horizontal Stacked Bar",
  component: HorizontalStackedBar,
  decorators: [withKnobs],
};

export const SimpleExample = () => {
  const results = [
    { votes: number("PSD votes", 2000), color: "#ff0000" },
    { votes: number("UDMR votes", 700), color: "#00ff00" },
    { votes: number("PMP votes", 500), color: "#0060aa" },
    { votes: number("USR votes", 1000), color: "#00f0ff" },
    { votes: number("PNL votes", 1800), color: "#0000ff" },
  ];

  return <HorizontalStackedBar results={results} />;
};
