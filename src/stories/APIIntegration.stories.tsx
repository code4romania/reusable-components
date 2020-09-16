/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useMemo } from "react";
import { useApiResponse } from "../util/api";
import { ElectionAPI, makeElectionApi } from "../util/electionApi";
import { mockElectionAPI } from "../util/mocks";
import { ElectionObservationSection } from "../components/ElectionObservationSection/ElectionObservationSection";
import { ElectionTurnoutSection } from "../components/ElectionTurnoutSection/ElectionTurnoutSection";
import { APIRequestPreview } from "./APIRequestPreview";
import { ScopeArgs, scopeArgTypes, useScopeFromArgs } from "./util";
import { electionApiProductionUrl } from "../constants/servers";
// eslint-disable-next-line max-len
import { ElectionResultsSummarySection } from "../components/ElectionResultsSummarySection/ElectionResultsSummarySection";
import { ElectionResultsProcess } from "../components/ElectionResultsProcess/ElectionResultsProcess";
import { ElectionResultsSeats } from "../components/ElectionResultsSeats/ElectionResultsSeats";
import { ElectionResultsTableSection } from "../components/ElectionResultsTableSection/ElectionResultsTableSection";

export default {
  title: "API integrations",
  argTypes: {
    api: {
      defaultValue: "mock",
      control: {
        type: "radio",
        options: ["mock", "real"],
      },
    },
    apiUrl: {
      defaultValue: electionApiProductionUrl,
      control: "text",
    },
    id: {
      defaultValue: "mock-election-id",
      control: "text",
    },
    ...scopeArgTypes,
  },
};

export const ElectionComponents = (args: { api: string; apiUrl: string; id: string } & ScopeArgs) => {
  const [scope, { api, apiUrl, id }] = useScopeFromArgs(args);
  const electionApi: ElectionAPI = useMemo(() => (api === "mock" ? mockElectionAPI : makeElectionApi({ apiUrl })), [
    api,
    apiUrl,
  ]);
  const { data, loading, error } = useApiResponse(() => electionApi.getElection(id, scope), [electionApi, id, scope]);

  return (
    <>
      <APIRequestPreview data={data} loading={loading} error={error} />
      {data && (
        <>
          <ElectionTurnoutSection meta={data.meta} scope={data.scope} turnout={data.turnout} />
          {data.observation && <ElectionObservationSection observation={data.observation} />}
          <ElectionResultsSummarySection meta={data.meta} scope={data.scope} results={data.results} />
          {data.results && <ElectionResultsProcess results={data.results} />}
          {data.results && <ElectionResultsSeats results={data.results} />}
          {data.results && <ElectionResultsTableSection meta={data.meta} results={data.results} />}
        </>
      )}
    </>
  );
};
