/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockCandidatesList } from "../../util/mocks";
import { ElectionCandidatesTableSection } from "./ElectionCandidatesTableSection";

export default {
  title: "Election results candidates tables section",
  component: ElectionCandidatesTableSection,
};

export const SimpleExample = () => {
  return <ElectionCandidatesTableSection heading="Partid" parties={mockCandidatesList} />;
};
