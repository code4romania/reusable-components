import React from "react";
import { HorizontalStackedBar } from "./HorizontalStackedBar.tsx";

export default {
  title: "Horizontal Stacked Bar",
  component: HorizontalStackedBar,
};

export const SimpleExample = (args) => {
  return <HorizontalStackedBar {...args} />;
};

SimpleExample.args = {
  labelLeft: "Left label",
  labelRight: "Right label",
  items: [
    { value: 2000, color: "#ff0000" },
    { value: 700, color: "#00ff00" },
    { value: 500, color: "#0060aa" },
    { value: 1000, color: "#00f0ff" },
    { value: 1800, color: "#0000ff" },
  ],
};

SimpleExample.argTypes = {
  labelLeft: { control: "text" },
  labelRight: { control: "text" },
  items: { control: "object" },
};
