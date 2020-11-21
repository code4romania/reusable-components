/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionScopeIncompleteResolved } from "../../types/Election";
import {
  mockCountyCouncilElectionMeta,
  mockCountyCouncilResults,
  mockCountyElectionScope,
  mockDiasporaElectionScope,
  mockElectionAPI,
  mockLocalCouncilElectionMeta,
  mockLocalCouncilResults,
  mockLocalityElectionScope,
  mockMayorElectionMeta,
  mockMayorResults,
  mockNationalElectionScope,
  mockPresidentialElectionMeta,
  mockResults,
} from "../../util/mocks";
import { ElectionResultsSummarySection } from "./ElectionResultsSummarySection";

export default {
  title: "Election results / Summary section",
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

export const MayorPerCountyElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockCountyElectionScope}
      meta={mockMayorElectionMeta}
      results={mockMayorResults}
      api={mockElectionAPI}
    />
  );
};

export const LocalCouncilElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockCountyElectionScope}
      meta={mockLocalCouncilElectionMeta}
      results={mockLocalCouncilResults}
      api={mockElectionAPI}
    />
  );
};

export const CountyCouncilElection = () => {
  return (
    <ElectionResultsSummarySection
      scope={mockNationalElectionScope}
      meta={mockCountyCouncilElectionMeta}
      results={mockCountyCouncilResults}
      api={mockElectionAPI}
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
