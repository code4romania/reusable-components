/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { mockLocalCouncilElectionMeta, mockResults } from "../../util/mocks";
import { ElectionResultsSummaryTable } from "./ElectionResultsSummaryTable";

export default {
  title: "Election results summary table",
  component: ElectionResultsSummaryTable,
};

export const SimpleExample = (args: any) => {
  return <ElectionResultsSummaryTable {...args} />;
};

SimpleExample.args = {
  meta: mockLocalCouncilElectionMeta,
  results: mockResults,
  table: { tHead1: "Partid", tHead2: "Mand.", tHead3: "Voturi", tHead4: "%" },
};

SimpleExample.argTypes = {
  results: { control: "object" },
};
