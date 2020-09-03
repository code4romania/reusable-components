/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { PercentageBarsLegend } from "./PercentageBarsLegend";
import { withKnobs, text, color, number } from "@storybook/addon-knobs";
import { useTheme } from "../../util/theme";
import { PercentageBars } from "../PercentageBars/PercentageBars";

export default {
  title: "Percentage bars legend",
  component: PercentageBarsLegend,
  decorators: [withKnobs],
};

export const SimpleExample = () => {
  const theme = useTheme();

  return (
    <PercentageBarsLegend
      items={[
        {
          legendColor: color("color", theme.colors.primary, "bar1"),
          legendName: text("name", "Cetățeni cu drept de vot", "bar1"),
          legendValueLabel: text("label", "100%", "bar1"),
          legendNote: text("note", "(200.000)", "bar1"),
        },
        {
          legendColor: color("color", theme.colors.secondary, "bar2"),
          legendName: text("name", "Au votat", "bar2"),
          legendValueLabel: text("label", "50%", "bar2"),
          legendNote: text("note", "(100.000)", "bar2"),
        },
      ]}
    />
  );
};

export const BarsWithLegend = () => {
  const theme = useTheme();

  const items = [
    {
      color: color("color", theme.colors.primary, "bar1"),
      legendName: text("name", "Cetățeni cu drept de vot", "bar1"),
      valueLabel: text("label", "100%", "bar1"),
      value: number("value", 100, undefined, "bar1"),
      legendNote: text("note", "(200.000)", "bar1"),
    },
    {
      color: color("color", theme.colors.secondary, "bar2"),
      legendName: text("name", "Au votat", "bar2"),
      valueLabel: text("label", "50%", "bar2"),
      value: number("value", 50, undefined, "bar2"),
      legendNote: text("note", "(100.000)", "bar2"),
    },
  ];

  return (
    <>
      <PercentageBars total={number("total", 100)} items={items} />
      <PercentageBarsLegend items={items} />
    </>
  );
};
