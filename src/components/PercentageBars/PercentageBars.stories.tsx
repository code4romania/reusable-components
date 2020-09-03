/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { PercentageBars } from "./PercentageBars";
import { number, withKnobs, text, color } from "@storybook/addon-knobs";
import { useTheme } from "../../util/theme";

export default {
  title: "Percentage bars",
  component: PercentageBars,
  decorators: [withKnobs],
};

export const SimpleExample = () => {
  const theme = useTheme();

  return (
    <PercentageBars
      total={number("total", undefined)}
      items={[
        {
          value: number("value", 100, undefined, "bar1"),
          label: text("label", "100%", "bar1"),
          color: color("color", theme.colors.primary, "bar1"),
        },
        {
          value: number("value", 50, undefined, "bar2"),
          label: text("label", "50%", "bar2"),
          color: color("color", theme.colors.secondary, "bar2"),
        },
      ]}
    />
  );
};
