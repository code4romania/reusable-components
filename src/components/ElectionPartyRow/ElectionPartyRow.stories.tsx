/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionPartyRow } from "./ElectionPartyRow";
import { mockCandidatesList } from "../../util/mocks";

export default {
  title: "Election Party Row",
  component: ElectionPartyRow,
};

export const SimpleExample = () => (
  <ElectionPartyRow name={mockCandidatesList[0].name} candidates={mockCandidatesList[0].candidates} />
);
