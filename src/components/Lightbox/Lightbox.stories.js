import React from "react";
import { Lightbox } from "./Lightbox.tsx";

export default {
  title: "Lightbox",
  component: Lightbox,
  argTypes: {
    src: { control: "string" },
    onRequestClose: { action: "onRequestClose" },
  },
  args: {
    src: "https://placekitten.com/600/900",
  },
};

export const SimpleExample = (args) => {
  return <Lightbox {...args} />;
};
