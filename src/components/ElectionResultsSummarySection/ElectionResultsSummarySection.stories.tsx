/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionScopeIncompleteResolved } from "../../types/Election";
import {
  mockDiasporaElectionScope,
  mockLocalCouncilElectionMeta,
  mockLocalityElectionScope,
  mockNationalElectionScope,
  mockPresidentialElectionMeta,
  mockResults,
} from "../../util/mocks";
import { ElectionResultsSummarySection } from "./ElectionResultsSummarySection";

export default {
  title: "Election results summary section",
  component: ElectionResultsSummarySection,
};

export const PresidentialElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockNationalElectionScope}
      meta={mockPresidentialElectionMeta}
      results={mockResults}
    />
  );
};

export const LocalCouncilElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockNationalElectionScope}
      meta={mockLocalCouncilElectionMeta}
      results={mockResults}
    />
  );
};

export const DiasporaElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockDiasporaElectionScope}
      meta={mockLocalCouncilElectionMeta}
      results={mockResults}
    />
  );
};

export const UnavailableData = () => {
  return <ElectionResultsSummarySection scope={mockNationalElectionScope} meta={mockLocalCouncilElectionMeta} />;
};

export const IncompleteCounty = () => {
  return (
    <ElectionResultsSummarySection scope={{ type: "county", countyId: null }} meta={mockLocalCouncilElectionMeta} />
  );
};

export const IncompleteCountyAndLocality = () => {
  return (
    <ElectionResultsSummarySection
      scope={{ type: "locality", countyId: null, localityId: null }}
      meta={mockLocalCouncilElectionMeta}
    />
  );
};

export const IncompleteLocality = () => {
  return (
    <ElectionResultsSummarySection
      scope={({ ...mockLocalityElectionScope, localityId: null } as unknown) as ElectionScopeIncompleteResolved}
      meta={mockLocalCouncilElectionMeta}
    />
  );
};

export const IncompleteCountry = () => {
  return (
    <ElectionResultsSummarySection
      scope={{ type: "diaspora_country", countryId: null }}
      meta={mockLocalCouncilElectionMeta}
    />
  );
};
