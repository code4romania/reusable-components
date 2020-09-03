import React from "react";
import cssClasses from "./PercentageBarsLegend.module.scss";
import { mergeClasses, themable } from "../../util/theme";
import classes from "./PercentageBarsLegend.module.scss";
import { DivBody } from "../Typography/Typography";

type Props = {
  items: {
    legendName: React.ElementType | string | number;
    legendValueLabel?: React.ElementType | string | number; // Defaults to valueLabel
    legendNote?: React.ElementType | string | number;
    legendColor?: string; // Defaults to color
    legendClassName?: string;

    valueLabel?: React.ElementType | string | number;
    color?: string;
  }[];
};

const exists = (x) => x || x === 0;

export const PercentageBarsLegend = themable<Props>(
  "PercentageBarsLegend",
  cssClasses,
)(({ items }) => {
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
