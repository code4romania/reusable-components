/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults } from "../../util/mocks";
import { ElectionResultsDiscreteTableSection } from "./ElectionResultsDiscreteTableSection";
import cssClasses from "./ElectionResultsDiscreteTableSection.module.scss";

export default {
  title: "Election results discrete tables section",
  component: ElectionResultsDiscreteTableSection,
};

export const SimpleExample = () => {
  return <ElectionResultsDiscreteTableSection candidates={mockResults.candidates} classes={cssClasses} />;
};
