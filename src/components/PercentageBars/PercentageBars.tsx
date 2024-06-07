import React, { ReactNode } from "react";
import { ClassNames, mergeClasses, themable } from "../../hooks/theme";
import { useDimensions } from "../../hooks/useDimensions";
import cssClasses from "./PercentageBars.module.scss";

type Item = {
  value: number;
  valueLabel?: ReactNode;
  color?: string;
  labelColor?: string;
  className?: string;
  labelClassName?: string;
  labelFlippedClassName?: string;
};

const PercentageBar = ({ item, multiplier, classes }: { item: Item; multiplier: number; classes: ClassNames }) => {
  const [barRef, { width: barWidth }] = useDimensions();
  const [labelRef, { width: labelWidth }] = useDimensions();

  const flipped = barWidth != null && labelWidth != null && labelWidth > barWidth;

  return (
    <div
      className={mergeClasses(classes.bar, item.className)}
      style={{
        backgroundColor: item.color,
        width: `${item.value * multiplier}%`,
      }}
      ref={barRef}
    >
      <div
        style={{ right: flipped ? -(labelWidth || 0) : 0 }}
        className={mergeClasses(
          mergeClasses(classes.label, item.labelClassName),
          flipped && mergeClasses(classes.labelRight, item.labelFlippedClassName),
        )}
        ref={labelRef}
      >
        <div className={classes.labelInner} style={{ color: item?.labelColor }}>
          {item.valueLabel}
        </div>
      </div>
    </div>
  );
};

type Props = {
  total?: number; // Defaults to the max value in items
  items: Item[];
};

export const PercentageBars = themable<Props>(
  "PercentageBars",
  cssClasses,
)(({ total, items, classes }) => {
  const multiplier = 100.0 / (total ?? items.reduce((acc, bar) => Math.max(acc, bar.value), 0));
  return (
    <div className={classes.root}>
      {items.map((item, index) => (
        <PercentageBar key={index} multiplier={multiplier} item={item} classes={classes} />
      ))}
    </div>
  );
});
