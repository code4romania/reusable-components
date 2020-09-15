/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockLocalCouncilElectionMeta, mockResults } from "../../util/mocks";
import { ElectionResultsSummaryTable } from "./ElectionResultsSummaryTable";

export default {
  title: "Election results summary table",
  component: ElectionResultsSummaryTable,
};

export const SimpleExample = (args) => {
  return <ElectionResultsSummaryTable {...args} />;
};

SimpleExample.args = {
  meta: mockLocalCouncilElectionMeta,
  results: mockResults,
};

SimpleExample.argTypes = {
  results: { control: "object" },
};
