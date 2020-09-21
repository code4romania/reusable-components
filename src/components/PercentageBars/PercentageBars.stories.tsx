/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { PercentageBars } from "./PercentageBars";

export default {
  title: "Percentage bars",
  component: PercentageBars,
  argTypes: {
    total: { control: "number" },
  },
};

export const SimpleExample = ({ value1, label1, color1, value2, label2, color2, ...args }: any) => (
  <PercentageBars
    {...args}
    items={[
      { value: value1, valueLabel: label1, color: color1 },
      { value: value2, valueLabel: label2, color: color2 },
    ]}
  />
);

SimpleExample.args = {
  value1: 100,
  label1: "100%",
  color1: "#FFCC00",
  value2: 50,
  label2: "50%",
  color2: "#352245",
};

SimpleExample.argTypes = {
  value1: { control: "number" },
  label1: { control: "text" },
  color1: { control: "color" },
  value2: { control: "number" },
  label2: { control: "text" },
  color2: { control: "color" },
};
