/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionScopeIncompleteResolved } from "../../types/Election";
import {
  mockDiasporaElectionScope,
  mockLocalCouncilElectionMeta,
  mockLocalityElectionScope,
  mockNationalElectionScope,
  mockPresidentialElectionMeta,
  mockPresidentialElectionTurnout,
} from "../../util/mocks";
import { ElectionTurnoutSection } from "./ElectionTurnoutSection";

export default {
  title: "Election turnout section",
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

export const LocalCouncilElection = () => {
  return (
    <ElectionTurnoutSection
      scope={mockNationalElectionScope}
      meta={mockLocalCouncilElectionMeta}
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
      meta={mockLocalCouncilElectionMeta}
      turnout={{
        ...mockPresidentialElectionTurnout,
        eligibleVoters: null,
        breakdown: [(mockPresidentialElectionTurnout.breakdown || [])[1]],
      }}
    />
  );
};

export const UnavailableData = () => {
  return <ElectionTurnoutSection scope={mockNationalElectionScope} meta={mockLocalCouncilElectionMeta} />;
};

export const IncompleteCounty = () => {
  return <ElectionTurnoutSection scope={{ type: "county", countyId: null }} meta={mockLocalCouncilElectionMeta} />;
};

export const IncompleteCountyAndLocality = () => {
  return (
    <ElectionTurnoutSection
      scope={{ type: "locality", countyId: null, localityId: null }}
      meta={mockLocalCouncilElectionMeta}
    />
  );
};

export const IncompleteLocality = () => {
  return (
    <ElectionTurnoutSection
      scope={({ ...mockLocalityElectionScope, localityId: null } as unknown) as ElectionScopeIncompleteResolved}
      meta={mockLocalCouncilElectionMeta}
    />
  );
};

export const IncompleteCountry = () => {
  return (
    <ElectionTurnoutSection scope={{ type: "diaspora_country", countryId: null }} meta={mockLocalCouncilElectionMeta} />
  );
};
