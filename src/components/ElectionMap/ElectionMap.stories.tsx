/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockLocalityElectionScope, mockCountyElectionScope, mockNationalElectionScope } from "../../util/mocks";
import { ElectionMap } from "./ElectionMap";

export default {
  title: "Election Map",
  component: ElectionMap,
  argTypes: {
    scope: {
      defaultValue: mockLocalityElectionScope,
      control: {
        type: "radio",
        options: {
          national: mockNationalElectionScope,
          county: mockCountyElectionScope,
          locality: mockLocalityElectionScope,
        },
      },
    },
    involvesDiaspora: {
      control: "boolean",
      defaultValue: true,
    },
  },
};

export const SimpleExample = (args) => {
  return <ElectionMap {...args} />;
};

export const ExampleWithChildren = (args) => {
  return (
    <ElectionMap {...args}>
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
