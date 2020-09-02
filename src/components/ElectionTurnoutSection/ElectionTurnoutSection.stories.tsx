/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockPresidentialElectionMeta, mockPresidentialElectionTurnout } from "../../util/mocks";
import { ElectionTurnoutSection } from "./ElectionTurnoutSection";

export default {
  title: "Election Turnout Section",
  component: ElectionTurnoutSection,
};

export const PresidentialElection = () => {
  return <ElectionTurnoutSection meta={mockPresidentialElectionMeta} turnout={mockPresidentialElectionTurnout} />;
};
