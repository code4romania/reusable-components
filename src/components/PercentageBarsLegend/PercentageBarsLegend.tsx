import React, { ReactNode } from "react";
import cssClasses from "./PercentageBarsLegend.module.scss";
import { mergeClasses, themable } from "../../util/theme";
import { DivBody } from "../Typography/Typography";

type Props = {
  items: {
    legendName: ReactNode;
    legendValueLabel?: ReactNode; // Defaults to valueLabel
    legendNote?: ReactNode;
    legendColor?: string; // Defaults to color
    legendClassName?: string;

    valueLabel?: ReactNode;
    color?: string;
  }[];
};

function exists<T>(x: T | null | 0 | false): T | boolean {
  return x || false;
}

export const PercentageBarsLegend = themable<Props>(
  "PercentageBarsLegend",
  cssClasses,
)(({ items, classes }) => {
  return (
    <div className={classes.root}>
      {items.map((item, index) => (
        <DivBody key={index} className={mergeClasses(classes.item, item.legendClassName)}>
          <div className={classes.colorSquare} style={{ backgroundColor: item.legendColor ?? item.color }} />
          <span className={classes.name}>{item.legendName}</span>
          {exists(item.legendValueLabel ?? item.valueLabel) && (
            <>
              {" - "}
              <span className={classes.valueLabel}>{item.legendValueLabel ?? item.valueLabel}</span>
            </>
          )}
          {exists(item.legendNote) && (
            <>
              {" "}
              <span className={classes.note}>{item.legendNote}</span>
            </>
          )}
        </DivBody>
      ))}
    </div>
  );
});
