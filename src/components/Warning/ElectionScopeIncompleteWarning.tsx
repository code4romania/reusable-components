import React from "react";
import { ElectionScopeCompleteness } from "../../types/Election";
import { themable } from "../../util/theme";
import { DivBodyHuge } from "../Typography/Typography";
import cssClasses from "./ElectionScopeIncompleteWarning.module.scss";

const pageName = (page: string | void) => {
  switch (page) {
    case "turnout":
      return "prezența la vot";
    case "results":
      return "rezultatele";
    default:
      return "datele";
  }
};

const missingData = (completeness: ElectionScopeCompleteness) => {
  if (completeness.missingCounty && completeness.missingLocality) {
    return "județul și localitatea";
  }
  if (completeness.missingCounty) {
    return "județul";
  }
  if (completeness.missingLocality) {
    return "localitatea";
  }
  if (completeness.missingCountry) {
    return "țara";
  }
  return "";
};

export const ElectionScopeIncompleteWarning = themable<{
  completeness: ElectionScopeCompleteness;
  page?: "turnout" | "results" | void;
}>(
  "ElectionScopeIncompleteWarning",
  cssClasses,
)(({ classes, completeness, page }) =>
  completeness.complete ? null : (
    <DivBodyHuge className={classes.root}>
      Pentru a vizualiza {pageName(page)}, te rugăm să selectezi{" "}
      <span className={classes.missingData}>{missingData(completeness)}</span>.
    </DivBodyHuge>
  ),
);
