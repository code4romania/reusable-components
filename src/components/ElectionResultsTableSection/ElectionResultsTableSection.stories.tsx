/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import {
  mockLocalCouncilElectionMeta,
  mockLocalityElectionScope,
  mockMayorElectionMeta,
  mockMayorResults,
  mockNationalElectionScope,
  mockResults,
} from "../../util/mocks";
import { ElectionResultsTableSection } from "./ElectionResultsTableSection";

export default {
  title: "Election results / Tables section",
  component: ElectionResultsTableSection,
};

export const SimpleExample = () => {
  return (
    <ElectionResultsTableSection
      meta={mockLocalCouncilElectionMeta}
      results={mockResults}
      scope={mockLocalityElectionScope}
    />
  );
};

export const DiscreteExample = () => {
  return (
    <ElectionResultsTableSection
      meta={mockMayorElectionMeta}
      results={mockMayorResults}
      scope={mockNationalElectionScope}
    />
  );
};
