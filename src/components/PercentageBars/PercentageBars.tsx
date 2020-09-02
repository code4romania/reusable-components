import React from "react";
import cssClasses from "./PercentageBars.module.scss";
import { mergeClasses, themable } from "../../util/theme";
import classes from "./PercentageBars.module.scss";

type Props = {
  total?: number; // Defaults to the max value in bars
  bars: {
    value: number;
    label?: React.ElementType | string | number;
    color?: string;
    labelColor?: string;
    className?: string;
  }[];
};

export const PercentageBars = themable<Props>(
  "PercentageBars",
  cssClasses,
)(({ total, bars }) => {
  const multiplier = 100.0 / (total ?? bars.reduce((acc, bar) => Math.max(acc, bar.value), 0));
  return (
    <div className={classes.root}>
      {bars.map((bar, index) => (
        <div
          key={index}
          className={mergeClasses(classes.bar, bar.className)}
          style={{
            backgroundColor: bar.color,
            width: `${bar.value * multiplier}%`,
          }}
        >
          <div className={classes.label}>{bar.label}</div>
        </div>
      ))}
    </div>
  );
});
