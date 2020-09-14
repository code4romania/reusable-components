import React from "react";
import { themable } from "../../util/theme";
import cssClasses from "./ColoredSquare.module.scss";

type Props = {
  color?: string;
};

export const ColoredSquare = themable<Props>(
  "ColoredSquare",
  cssClasses,
)(({ classes, color }) => <div className={classes.root} style={{ backgroundColor: color }} />);
