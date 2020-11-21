/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  mockCountyCouncilElectionMeta,
  mockCountyCouncilResults,
  mockLocalCouncilElectionMeta,
  mockLocalityElectionScope,
  mockNationalElectionScope,
  mockResults,
} from "../../util/mocks";
import { ElectionResultsSummaryTable } from "./ElectionResultsSummaryTable";

export default {
  title: "Election results / Summary table",
  component: ElectionResultsSummaryTable,
};

export const SimpleExample = (args: any) => {
  return <ElectionResultsSummaryTable {...args} />;
};

SimpleExample.args = {
  meta: mockLocalCouncilElectionMeta,
  scope: mockLocalityElectionScope,
  results: mockResults,
  header: { candidate: "Partid", seats: "Mand.", votes: "Voturi", percentage: "%" },
};

SimpleExample.argTypes = {
  results: { control: "object" },
  header: { control: "object" },
  scope: { control: "object" },
};

export const ExampleWithVotesAsSeats = (args: any) => {
  return <ElectionResultsSummaryTable {...args} />;
};

ExampleWithVotesAsSeats.args = {
  meta: mockCountyCouncilElectionMeta,
  results: mockCountyCouncilResults,
  scope: mockNationalElectionScope,
  header: { candidate: "Partid", seats: "Mand.", votes: "Voturi", percentage: "%" },
};

ExampleWithVotesAsSeats.argTypes = {
  results: { control: "object" },
  header: { control: "object" },
  scope: { control: "object" },
};
