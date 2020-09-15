/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { BarChart } from "./BarChart";

export default {
  title: "Bar chart",
  component: BarChart,
  args: {
    ...BarChart.defaultProps,
  },
  argTypes: {
    width: { control: "number" },
    height: { control: "number" },
    yGridSteps: { control: "number" },
    yMax: { control: "number" },
    fontSize: { control: "number" },
  },
};

export const SimpleExample = ({ bar1Color, bar1Value, bar2Color, bar2Value, bar3Color, bar3Value, ...args }) => {
  return (
    <BarChart
      {...args}
      bars={[
        { color: bar1Color, value: bar1Value },
        { color: bar2Color, value: bar2Value },
        { color: bar3Color, value: bar3Value },
      ]}
    />
  );
};

SimpleExample.args = {
  bar1Color: "red",
  bar1Value: 1,
  bar2Color: "blue",
  bar2Value: 0.5,
  bar3Color: "yellow",
  bar3Value: 0.25,
};

SimpleExample.argTypes = {
  bar1Color: { control: "color" },
  bar1Value: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  bar2Color: { control: "color" },
  bar2Value: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  bar3Color: { control: "color" },
  bar3Value: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
};
