/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  mockCountyCouncilElectionMeta,
  mockCountyCouncilResults,
  mockLocalCouncilElectionMeta,
  mockResults,
} from "../../util/mocks";
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
  header: { candidate: "Partid", seats: "Mand.", votes: "Voturi", percentage: "%" },
};

SimpleExample.argTypes = {
  results: { control: "object" },
  header: { control: "object" },
};

export const ExampleWithVotesAsSeats = (args: any) => {
  return <ElectionResultsSummaryTable {...args} />;
};

ExampleWithVotesAsSeats.args = {
  meta: mockCountyCouncilElectionMeta,
  results: mockCountyCouncilResults,
  header: { candidate: "Partid", seats: "Mand.", votes: "Voturi", percentage: "%" },
  displayVotesAsSeats: true,
};

ExampleWithVotesAsSeats.argTypes = {
  results: { control: "object" },
  header: { control: "object" },
};
