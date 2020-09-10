/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { useApiResponse } from "../util/api";
import { ElectionAPI, makeElectionApi } from "../util/electionApi";
import { mockElectionAPI, mockNationalElectionScope } from "../util/mocks";
import { ElectionObservationSection } from "../components/ElectionObservationSection/ElectionObservationSection";
import { ElectionTurnoutSection } from "../components/ElectionTurnoutSection/ElectionTurnoutSection";
import { APIRequestPreview } from "./APIRequestPreview";

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
  },
};

export const AllComponents = (args: { api: string; electionId: string }) => {
  const { api, electionId } = args;
  const electionApi: ElectionAPI = apis[api];
  const { data, loading, error } = useApiResponse(
    () => electionApi.getElection(electionId, mockNationalElectionScope),
    [electionApi, electionId],
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
