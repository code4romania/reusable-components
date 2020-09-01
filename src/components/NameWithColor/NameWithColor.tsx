import React from "react";
import classes from "./NameWithColor.module.scss";

type Props = {
  text: string;
  color: string;
  rightAligned?: boolean;
};

export const NameWithColor: React.FC<Props> = ({ text, color, rightAligned }) => (
  <div className={classes.nameWithColor}>
    <div
      className={classes.colorMarker}
      style={{
        backgroundColor: color,
        float: rightAligned ? "right" : "left",
      }}
    />
    {text}
  </div>
);
