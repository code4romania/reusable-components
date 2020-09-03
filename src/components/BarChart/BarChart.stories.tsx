/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { BarChart } from "./BarChart";
import { color, number, withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Bar chart",
  component: BarChart,
  decorators: [withKnobs],
};

export const SimpleExample = () => {
  return (
    <BarChart
      width={number("width", BarChart.defaultProps.width, { min: 0, max: 1000 })}
      height={number("height", BarChart.defaultProps.height, { min: 0, max: 1000 })}
      yGridSteps={number("ySteps", BarChart.defaultProps.yGridSteps, { min: 0, max: 20 })}
      yMax={number("yMax", BarChart.defaultProps.yMax)}
      fontSize={number("fontSize", BarChart.defaultProps.fontSize, { min: 0, max: 30 })}
      bars={[
        { color: color("bar1_color", "red"), value: number("bar1_value", 1, { min: 0, max: 1, step: 0.1 }) },
        { color: color("bar2_color", "blue"), value: number("bar2_value", 0.5, { min: 0, max: 1, step: 0.1 }) },
        { color: color("bar3_color", "yellow"), value: number("bar3_value", 0.25, { min: 0, max: 1, step: 0.1 }) },
      ]}
    />
  );
};
