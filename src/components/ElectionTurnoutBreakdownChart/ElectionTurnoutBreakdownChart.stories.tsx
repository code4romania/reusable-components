/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockPresidentialElectionTurnout } from "../../util/mocks";
import { ElectionTurnoutBreakdownChart } from "./ElectionTurnoutBreakdownChart";

export default {
  title: "Election turnout breakdown chart",
  component: ElectionTurnoutBreakdownChart,
};

export const NationalBreakdown = () => {
  return <ElectionTurnoutBreakdownChart value={(mockPresidentialElectionTurnout.breakdown || [])[0]} />;
};

export const DiasporaBreakdown = () => {
  return <ElectionTurnoutBreakdownChart value={(mockPresidentialElectionTurnout.breakdown || [])[1]} />;
};

export const FullScopeBreakdown = () => {
  return (
    <ElectionTurnoutBreakdownChart
      value={{
        ...(mockPresidentialElectionTurnout.breakdown || [])[0],
        type: "all",
      }}
    />
  );
};
