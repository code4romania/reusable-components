import React, { ReactNode } from "react";
import { themable } from "../../hooks/theme";
import { DivBody } from "../Typography/Typography";
import cssClasses from "./HorizontalStackedBar.module.scss";

export type HorizontalStackedBarItem = {
  value: number;
  color: string;
  className?: string;
};

type Props = {
  total?: number; // Defaults to the max value in items
  items: HorizontalStackedBarItem[];
  labelLeft?: ReactNode;
  labelRight?: ReactNode;
};

export const HorizontalStackedBar = themable<Props>(
  "PercentageBars",
  cssClasses,
)(({ total, items, labelLeft, labelRight, classes }) => {
  const multiplier = 100.0 / (total ?? items.reduce((acc, bar) => acc + bar.value, 0));
  let sum = 0;
  return (
    <div className={classes.root}>
      <svg className={classes.svg} preserveAspectRatio="none" viewBox="0 0 100 80">
        {items.map((item, index) => {
          const x = sum * multiplier;
          sum += item.value;
          return (
            <rect
              key={index}
              className={item.className}
              x={x}
              y={8}
              width={item.value * multiplier}
              height={64}
              fill={item.color}
            />
          );
        })}
        <line x1={50} x2={50} y1={0} y2={80} vectorEffect="non-scaling-stroke" strokeWidth={1.5} stroke="#443F46" />
      </svg>
      {labelLeft != null && <DivBody className={classes.labelLeft}>{labelLeft}</DivBody>}
      {labelRight != null && <DivBody className={classes.labelRight}>{labelRight}</DivBody>}
    </div>
  );
});
