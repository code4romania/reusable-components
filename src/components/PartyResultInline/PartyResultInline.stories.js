import React from "react";
import { PartyResultInline } from "./PartyResultInline.tsx";

export default {
  title: "Party Result Inline",
  component: PartyResultInline,
  args: {
    color: "#ff0000",
    name: "PSD",
    percentage: 0.2356,
    votes: 2000000,
  },
  argTypes: {
    color: { control: "color" },
    name: { control: "text" },
    percentage: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
    votes: { control: "number" },
  },
};

export const SimpleExample = (args) => {
  return <PartyResultInline {...args} />;
};
