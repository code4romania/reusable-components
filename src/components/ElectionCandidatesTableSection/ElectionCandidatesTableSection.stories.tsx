/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockCandidatesList } from "../../util/mocks";
import { ElectionCandidatesTableSection } from "./ElectionCandidatesTableSection";
import cssClasses from "./ElectionCandidatesTableSection.module.scss";

export default {
  title: "Election results candidates tables section",
  component: ElectionCandidatesTableSection,
};

export const SimpleExample = () => {
  return (
    <ElectionCandidatesTableSection
      classes={cssClasses}
      heading="Partid"
      ballot="Camera deputatilor"
      parties={mockCandidatesList}
    />
  );
};
