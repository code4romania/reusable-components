/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults } from "../../util/mocks";
import { ElectionResultsProcess } from "./ElectionResultsProcess";

export default {
  title: "Election results / Electoral process",
  component: ElectionResultsProcess,
};

export const SimpleExample = () => {
  return <ElectionResultsProcess results={mockResults} />;
};
