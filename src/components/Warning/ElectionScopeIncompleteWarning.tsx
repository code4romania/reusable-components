import React from "react";
import { ElectionScopeCompleteness } from "../../types/Election";
import { DivBodyHuge, Underlined } from "../Typography/Typography";

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

type Props = {
  className?: string;
  completeness: ElectionScopeCompleteness;
  page?: "turnout" | "results" | void;
};

export const ElectionScopeIncompleteWarning: React.FC<Props> = ({ className, completeness, page }) =>
  completeness.complete ? null : (
    <DivBodyHuge className={className}>
      Pentru a vizualiza {pageName(page)}, te rugăm să selectezi <Underlined>{missingData(completeness)}</Underlined>.
    </DivBodyHuge>
  );
