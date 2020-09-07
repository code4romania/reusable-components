/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ElectionScopeIncomplete } from "../../types/Election";
import { mockCityElectionScope, mockCountyElectionScope, mockNationalElectionScope } from "../../util/mocks";
import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import { ElectionMap } from "./ElectionMap";

export default {
  title: "Election Map",
  component: ElectionMap,
  decorators: [withKnobs],
};

const scopes = {
  national: mockNationalElectionScope,
  county: mockCountyElectionScope,
  locality: mockCityElectionScope,
};

export const SimpleExample = () => {
  return (
    <ElectionMap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scope={(select("scope", scopes as any, scopes.national as any) as unknown) as ElectionScopeIncomplete}
      involvesDiaspora={boolean("involvesDiaspora", true)}
    />
  );
};

export const ExampleWithChildren = () => {
  return (
    <ElectionMap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scope={(select("scope", scopes as any, scopes.national as any) as unknown) as ElectionScopeIncomplete}
      involvesDiaspora={boolean("involvesDiaspora", true)}
    >
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
