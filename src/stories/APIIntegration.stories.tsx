/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { useApiResponse } from "../util/api";
import { ElectionAPI, makeElectionApi } from "../util/electionApi";
import { mockElectionAPI } from "../util/mocks";
import { ElectionObservationSection } from "../components/ElectionObservationSection/ElectionObservationSection";
import { ElectionTurnoutSection } from "../components/ElectionTurnoutSection/ElectionTurnoutSection";
import { APIRequestPreview } from "./APIRequestPreview";
import { ElectionScope } from "../types/Election";

const realElectionAPI = makeElectionApi();

const apis = {
  mock: mockElectionAPI,
  real: realElectionAPI,
};

export default {
  title: "API Integrations",
  argTypes: {
    api: {
      defaultValue: "mock",
      control: {
        type: "radio",
        options: ["mock", "real"],
      },
    },
    electionId: {
      defaultValue: "mock-election-id",
      control: "text",
    },
    scopeType: {
      defaultValue: "national",
      control: {
        type: "radio",
        options: ["national", "county", "locality", "diaspora", "diaspora_country"],
      },
    },
    countyId: {
      defaultValue: 1,
      control: "number",
    },
    localityId: {
      defaultValue: 1,
      control: "number",
    },
    countryId: {
      defaultValue: 1,
      control: "number",
    },
  },
};

const buildScope = (scopeType, countyId, localityId, countryId): ElectionScope => {
  switch (scopeType) {
    case "national":
      return { type: "national" };
    case "county":
      return { type: "county", countyId };
    case "locality":
      return { type: "locality", countyId, localityId };
    case "diaspora":
      return { type: "diaspora" };
    case "diaspora_country":
      return { type: "diaspora_country", countryId };
    default:
      return { type: "national" };
  }
};

export const ElectionComponents = (args: {
  api: string;
  electionId: string;
  scopeType: string;
  countyId: number;
  localityId: number;
  countryId: number;
}) => {
  const { api, electionId, scopeType, countyId, localityId, countryId } = args;
  const electionApi: ElectionAPI = apis[api];
  const { data, loading, error } = useApiResponse(
    () => electionApi.getElection(electionId, buildScope(scopeType, countyId, localityId, countryId)),
    [electionApi, electionId, scopeType, countyId, localityId, countryId],
  );

  return (
    <>
      <APIRequestPreview data={data} loading={loading} error={error} />
      {data && (
        <>
          <ElectionTurnoutSection meta={data.meta} scope={data.scope} turnout={data.turnout} />
          {data.observation && <ElectionObservationSection observation={data.observation} />}
        </>
      )}
    </>
  );
};
