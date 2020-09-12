/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { useApiResponse } from "../util/api";
import { ElectionAPI, makeElectionApi } from "../util/electionApi";
import { mockElectionAPI } from "../util/mocks";
import { ElectionObservationSection } from "../components/ElectionObservationSection/ElectionObservationSection";
import { ElectionTurnoutSection } from "../components/ElectionTurnoutSection/ElectionTurnoutSection";
import { APIRequestPreview } from "./APIRequestPreview";
import { ScopeArgs, scopeArgTypes, useScopeFromArgs } from "./util";

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
    ...scopeArgTypes,
  },
};

export const ElectionComponents = (args: { api: string; electionId: string } & ScopeArgs) => {
  const [scope, { api, electionId }] = useScopeFromArgs(args);
  const electionApi: ElectionAPI = apis[api];
  const { data, loading, error } = useApiResponse(() => electionApi.getElection(electionId, scope), [scope]);

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
