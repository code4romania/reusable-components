/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useState } from "react";
import { useApiResponse } from "../util/api";
import { ElectionAPI, makeElectionApi } from "../util/electionApi";
import { mockElectionAPI, mockNationalElectionScope } from "../util/mocks";
import { ElectionTurnoutSection } from "./ElectionTurnoutSection/ElectionTurnoutSection";

const realElectionAPI = makeElectionApi();

const apis = {
  mock: mockElectionAPI,
  real: realElectionAPI,
};

const DataPreview = ({ data }) => {
  const [visible, setVisible] = useState(false);
  return (
    <pre
      onClick={() => {
        setVisible((x) => !x);
      }}
    >
      {visible ? JSON.stringify(data, null, 2) : "Click here to show data as JSON"}
    </pre>
  );
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
      {loading && <div>Loading...</div>}
      {error && <div>{error.toString()}</div>}
      {data && <DataPreview data={data} />}
      {data && (
        <>
          <ElectionTurnoutSection meta={data.meta} scope={data.scope} turnout={data.turnout} />
        </>
      )}
    </>
  );
};
