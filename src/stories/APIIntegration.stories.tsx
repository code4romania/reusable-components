/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useMemo, useState } from "react";
import { useApiResponse } from "../hooks/useApiResponse";
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
import { ElectionCandidatesTableSection } from "../components/ElectionCandidatesTableSection/ElectionCandidatesTableSection";
import { ElectionTimeline } from "../components/ElectionTimeline/ElectionTimeline";
import { ElectionCompatibleScopes, ElectionScopeIncomplete } from "../types/Election";
import { ElectionScopePicker, useElectionScopePickerApi } from "../components/ElectionScopePicker/ElectionScopePicker";
import { useBallotData } from "../hooks/electionApiHooks";
import { ElectionNewsSection } from "../components/ElectionNewsSection/ElectionNewsSection";

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
  },
};

const useApi = (api: string, apiUrl: string): ElectionAPI => {
  return useMemo(() => (api === "mock" ? mockElectionAPI : makeElectionApi({ apiUrl })), [api, apiUrl]);
};

export const ElectionComponents = (args: { api: string; apiUrl: string; id: string } & ScopeArgs) => {
  const [scope, { api, apiUrl, id }] = useScopeFromArgs(args);
  const electionApi: ElectionAPI = useApi(api, apiUrl);
  const { data, loading, error } = useBallotData(electionApi, id, scope);

  return (
    <>
      <APIRequestPreview data={data} loading={loading} error={error} />
      {data && (
        <>
          <ElectionTurnoutSection scope={data.scope} turnout={data.turnout} />
          {data.observation && <ElectionObservationSection observation={data.observation} />}
          <ElectionResultsSummarySection meta={data.meta} scope={data.scope} results={data.results} />
          {data.results && <ElectionResultsProcess results={data.results} />}
          {data.results?.totalSeats != null && data.results.totalSeats > 0 && (
            <ElectionResultsSeats results={data.results} />
          )}
          {data.results && <ElectionResultsTableSection meta={data.meta} results={data.results} scope={data.scope} />}
          {data.electionNews && data.electionNews.length > 0 && <ElectionNewsSection feed={data.electionNews} />}
        </>
      )}
    </>
  );
};

ElectionComponents.argTypes = {
  id: {
    defaultValue: 1,
    control: "number",
  },
  ...scopeArgTypes,
};

export const ElectionTimelineComponent = (args: { api: string; apiUrl: string }) => {
  const electionApi: ElectionAPI = useApi(args.api, args.apiUrl);
  const { data, loading, error } = useApiResponse(() => electionApi.getBallots(), [electionApi]);

  const [selectedBallotId, setSelectedBallotId] = useState<number | null>(null);

  return (
    <>
      <APIRequestPreview data={data} loading={loading} error={error} />
      {data && (
        <ElectionTimeline
          items={data}
          selectedBallotId={selectedBallotId}
          onSelectBallot={(meta) => {
            console.log("onSelectBallot", meta);
            setSelectedBallotId(meta.ballotId);
          }}
        />
      )}
    </>
  );
};

export const ElectionScopeComponent = (args: {
  api: string;
  apiUrl: string;
  ballotId: number;
  compatibleScopes?: ElectionCompatibleScopes;
}) => {
  const [scope, setScope] = useState<ElectionScopeIncomplete>({ type: "national" });
  const electionApi: ElectionAPI = useApi(args.api, args.apiUrl);
  const apiData = useElectionScopePickerApi(electionApi, scope, args.ballotId);
  return (
    <ElectionScopePicker apiData={apiData} value={scope} onChange={setScope} compatibleScopes={args.compatibleScopes} />
  );
};

ElectionScopeComponent.args = {
  ballotId: 1,
  compatibleScopes: {},
};

ElectionScopeComponent.argTypes = {
  ballotId: { control: "number" },
  compatibleScopes: { control: "object" },
};

export const ElectionCandidatesComponent = (args: { api: string; apiUrl: string }) => {
  const electionApi: ElectionAPI = useApi(args.api, args.apiUrl);
  const { data, loading, error } = useApiResponse(
    () => electionApi.getCandidates(1, { type: "county", countyId: 1 }),
    [electionApi],
  );

  return (
    <>
      <APIRequestPreview data={data} loading={loading} error={error} />
      {data && <ElectionCandidatesTableSection heading="Partid" parties={data} />}
    </>
  );
};
