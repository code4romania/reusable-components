/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import {
  mockLocalCouncilElectionMeta,
  mockNationalElectionScope,
  mockPresidentialElectionMeta,
  mockPresidentialElectionTurnout,
} from "../../util/mocks";
import { ElectionTurnoutSection } from "./ElectionTurnoutSection";

export default {
  title: "Election Turnout Section",
  component: ElectionTurnoutSection,
};

export const PresidentialElection = () => {
  return (
    <ElectionTurnoutSection
      scope={mockNationalElectionScope}
      meta={mockPresidentialElectionMeta}
      turnout={mockPresidentialElectionTurnout}
    />
  );
};

export const UnavailableData = () => {
  return <ElectionTurnoutSection scope={mockNationalElectionScope} meta={mockLocalCouncilElectionMeta} />;
};
