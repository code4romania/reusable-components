import React, { ComponentProps, forwardRef } from "react";
import { themable } from "../../util/theme";
import cssClasses from "./Button.module.scss";

export const Button = themable<ComponentProps<"button">>(
  "Button",
  cssClasses,
)(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
  forwardRef(({ classes, className, constants, ...otherProps }, ref) => (
    <button className={classes.root} {...otherProps} ref={ref} />
  )),
);
