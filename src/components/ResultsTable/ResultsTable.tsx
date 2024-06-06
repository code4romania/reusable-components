import React, { ComponentProps, forwardRef } from "react";
import { themable, ThemedComponent, ThemedComponentProps } from "../../hooks/theme";
import cssClasses from "./ResultsTable.module.scss";

export const ResultsTable = themable<ComponentProps<"table">>(
  "ResultsTable",
  cssClasses,
)(
  // eslint-disable-next-line react/display-name
  (forwardRef<HTMLTableElement, ThemedComponentProps<ComponentProps<"table">>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ classes, className, constants, ...otherProps }, ref) => (
      <table className={classes.root} {...otherProps} ref={ref} />
    ),
  ) as unknown) as ThemedComponent<ComponentProps<"table">>,
);
