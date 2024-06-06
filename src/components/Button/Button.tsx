import React, { ComponentProps, forwardRef } from "react";
import { themable, ThemedComponent, ThemedComponentProps } from "../../hooks/theme";
import cssClasses from "./Button.module.scss";

export const Button = themable<ComponentProps<"button">>(
  "Button",
  cssClasses,
)(
  // eslint-disable-next-line react/display-name
  (forwardRef<HTMLButtonElement, ThemedComponentProps<ComponentProps<"button">>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ classes, className, constants, ref, ...otherProps }, forwardedRef) => (
      <button className={classes.root} {...otherProps} ref={forwardedRef} />
    ),
  ) as unknown) as ThemedComponent<ComponentProps<"button">>,
);
