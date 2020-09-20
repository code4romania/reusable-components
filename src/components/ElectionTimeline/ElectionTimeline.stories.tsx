/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useState } from "react";
import { mockElectionList } from "../../util/mocks";
import { ElectionTimeline } from "./ElectionTimeline";

export default {
  title: "Election timeline",
  component: ElectionTimeline,
};

export const SimpleExample = () => {
  const [selectedBallotId, setSelectedBallotId] = useState<number | null>(null);
  return (
    <ElectionTimeline
      items={mockElectionList}
      selectedBallotId={selectedBallotId}
      onSelectBallot={(meta) => {
        console.log("onSelectBallot", meta);
        setSelectedBallotId(meta.ballotId);
      }}
    />
  );
};
