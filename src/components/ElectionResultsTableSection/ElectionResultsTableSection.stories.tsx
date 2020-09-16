/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockLocalCouncilElectionMeta, mockResults } from "../../util/mocks";
import { ElectionResultsTableSection } from "./ElectionResultsTableSection";

export default {
  title: "Election results tables section",
  component: ElectionResultsTableSection,
};

export const SimpleExample = () => {
  return <ElectionResultsTableSection meta={mockLocalCouncilElectionMeta} results={mockResults} />;
};
