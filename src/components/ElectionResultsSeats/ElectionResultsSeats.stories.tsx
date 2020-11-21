/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults } from "../../util/mocks";
import { ElectionResultsSeats } from "./ElectionResultsSeats";

export default {
  title: "Election results / Seats visualisation",
  component: ElectionResultsSeats,
};

export const SimpleExample = () => {
  return <ElectionResultsSeats results={mockResults} />;
};
