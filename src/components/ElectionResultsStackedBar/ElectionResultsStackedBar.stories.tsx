/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults } from "../../util/mocks";
import { ElectionResultsStackedBar } from "./ElectionResultsStackedBar";

export default {
  title: "Election Results Stacked Bar",
  component: ElectionResultsStackedBar,
};

export const SimpleExample = (args) => {
  return <ElectionResultsStackedBar {...args} />;
};

SimpleExample.args = {
  results: mockResults,
};

SimpleExample.argTypes = {
  results: { control: "object" },
};
