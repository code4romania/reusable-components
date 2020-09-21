/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { scopeFromArgs, scopeArgTypes } from "../../stories/util";
import { ElectionMap } from "./ElectionMap";

export default {
  title: "Election map",
  component: ElectionMap,
  argTypes: {
    ...scopeArgTypes,
    scopeType: {
      ...scopeArgTypes.scopeType,
      defaultValue: "locality",
    },
    involvesDiaspora: {
      control: "boolean",
      defaultValue: true,
    },
    onScopeChange: { action: "onScopeChange" },
  },
};

export const SimpleExample = (args: any) => {
  const [scope, otherArgs] = scopeFromArgs(args);
  return <ElectionMap scope={scope} {...otherArgs} />;
};

export const ExampleWithChildren = (args: any) => {
  const [scope, otherArgs] = scopeFromArgs(args);
  return (
    <ElectionMap scope={scope} {...otherArgs}>
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
