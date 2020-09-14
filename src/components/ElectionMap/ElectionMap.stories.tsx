/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { scopeFromArgs, scopeArgTypes } from "../../stories/util";
import { ElectionMap } from "./ElectionMap";

export default {
  title: "Election Map",
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
  },
};

const logScopeChange = (scope) => {
  console.log("onScopeChange", scope);
};

export const SimpleExample = (args) => {
  const [scope, otherArgs] = scopeFromArgs(args);
  return <ElectionMap scope={scope} onScopeChange={logScopeChange} {...otherArgs} />;
};

export const ExampleWithChildren = (args) => {
  const [scope, otherArgs] = scopeFromArgs(args);
  return (
    <ElectionMap scope={scope} onScopeChange={logScopeChange} {...otherArgs}>
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
