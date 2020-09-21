import React, { ReactNode } from "react";
import cssClasses from "./PercentageBars.module.scss";
import { mergeClasses, themable } from "../../hooks/theme";

type Props = {
  total?: number; // Defaults to the max value in items
  items: {
    value: number;
    valueLabel?: ReactNode;
    color?: string;
    labelColor?: string;
    className?: string;
  }[];
};

export const PercentageBars = themable<Props>(
  "PercentageBars",
  cssClasses,
)(({ total, items, classes }) => {
  const multiplier = 100.0 / (total ?? items.reduce((acc, bar) => Math.max(acc, bar.value), 0));
  return (
    <div className={classes.root}>
      {items.map((item, index) => (
        <div
          key={index}
          className={mergeClasses(classes.bar, item.className)}
          style={{
            backgroundColor: item.color,
            width: `${item.value * multiplier}%`,
          }}
        >
          <div className={classes.label}>{item.valueLabel}</div>
        </div>
      ))}
    </div>
  );
});
