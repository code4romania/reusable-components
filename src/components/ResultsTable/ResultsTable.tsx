import React, { ComponentProps, forwardRef } from "react";
import { themable } from "../../util/theme";
import cssClasses from "./ResultsTable.module.scss";

export const ResultsTable = themable<ComponentProps<"table">>(
  "ResultsTable",
  cssClasses,
)(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
  forwardRef(({ classes, className, constants, ...otherProps }, ref) => (
    <table className={classes.root} {...otherProps} ref={ref} />
  )),
);
