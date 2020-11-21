/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useMemo } from "react";
import { electionApiProductionUrl } from "../../constants/servers";
import { scopeFromArgs, scopeArgTypes } from "../../stories/util";
import { ElectionAPI, makeElectionApi } from "../../util/electionApi";
import { mockElectionAPI } from "../../util/mocks";
import { ElectionMap } from "./ElectionMap";

export default {
  title: "Election / Map",
  component: ElectionMap,
  argTypes: {
    ...scopeArgTypes,
    scopeType: {
      ...scopeArgTypes.scopeType,
      defaultValue: "county",
    },
    involvesDiaspora: {
      control: "boolean",
      defaultValue: true,
    },
    selectedColor: { control: "color" },
    onScopeChange: { action: "onScopeChange" },
    ballotId: { control: "number", defaultValue: 1 },
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

export const SimpleExample = (args: any) => {
  const [scope, { api, apiUrl, ...otherArgs }] = scopeFromArgs(args);
  const electionApi = useApi(api, apiUrl);
  return <ElectionMap scope={scope} api={electionApi} {...otherArgs} />;
};

export const ExampleWithChildren = (args: any) => {
  const [scope, { api, apiUrl, ...otherArgs }] = scopeFromArgs(args);
  const electionApi = useApi(api, apiUrl);
  return (
    <ElectionMap scope={scope} api={electionApi} {...otherArgs}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2em",
          fontWeight: 600,
          width: "40%",
          textAlign: "center",
        }}
      >
        This is a map overlay
      </div>
    </ElectionMap>
  );
};
