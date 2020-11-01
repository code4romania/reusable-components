/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults, mockCountyCouncilResults } from "../../util/mocks";
import { ElectionResultsStackedBar } from "./ElectionResultsStackedBar";

export default {
  title: "Election results stacked bar",
  component: ElectionResultsStackedBar,
};

export const SimpleExample = (args: any) => {
  return <ElectionResultsStackedBar {...args} />;
};

SimpleExample.args = {
  results: mockResults,
};

SimpleExample.argTypes = {
  results: { control: "object" },
};

export const ExampleWithDiscreteValues = (args: any) => {
  return <ElectionResultsStackedBar {...args} />;
};

ExampleWithDiscreteValues.args = {
  results: mockCountyCouncilResults,
  displayPercentages: false,
};

ExampleWithDiscreteValues.argTypes = {
  results: { control: "object" },
};
