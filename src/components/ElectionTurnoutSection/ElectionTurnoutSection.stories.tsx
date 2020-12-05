/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionScopeIncompleteResolved } from "../../types/Election";
import {
  mockDiasporaElectionScope,
  mockLocalityElectionScope,
  mockNationalElectionScope,
  mockPresidentialElectionTurnout,
} from "../../util/mocks";
import { ElectionTurnoutSection } from "./ElectionTurnoutSection";

export default {
  title: "Election / Turnout section",
  component: ElectionTurnoutSection,
};

export const PresidentialElection = () => {
  return <ElectionTurnoutSection scope={mockNationalElectionScope} turnout={mockPresidentialElectionTurnout} />;
};

export const LocalCouncilElection = () => {
  return (
    <ElectionTurnoutSection
      scope={mockNationalElectionScope}
      turnout={{
        ...mockPresidentialElectionTurnout,
        breakdown: [(mockPresidentialElectionTurnout.breakdown ?? [])[0]],
      }}
    />
  );
};

export const DiasporaElection = () => {
  return (
    <ElectionTurnoutSection
      scope={mockDiasporaElectionScope}
      turnout={{
        ...mockPresidentialElectionTurnout,
        eligibleVoters: mockPresidentialElectionTurnout.totalVotes,
        breakdown: [(mockPresidentialElectionTurnout.breakdown || [])[1]],
      }}
    />
  );
};

export const UnavailableData = () => {
  return <ElectionTurnoutSection scope={mockNationalElectionScope} />;
};

export const IncompleteCounty = () => {
  return <ElectionTurnoutSection scope={{ type: "county", countyId: null }} />;
};

export const IncompleteCountyAndLocality = () => {
  return <ElectionTurnoutSection scope={{ type: "locality", countyId: null, localityId: null }} />;
};

export const IncompleteLocality = () => {
  return (
    <ElectionTurnoutSection
      scope={({ ...mockLocalityElectionScope, localityId: null } as unknown) as ElectionScopeIncompleteResolved}
    />
  );
};

export const IncompleteCountry = () => {
  return <ElectionTurnoutSection scope={{ type: "diaspora_country", countryId: null }} />;
};
