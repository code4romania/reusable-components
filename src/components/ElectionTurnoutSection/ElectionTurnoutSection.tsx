import React from "react";
import { ElectionMeta, ElectionScope, ElectionTurnout } from "../../types/Election";
import { getScopeName } from "../../util/format";
import { themable } from "../../util/theme";
import { ElectionTurnoutBars } from "../ElectionTurnoutBars/ElectionTurnoutBars";
import { BodyHuge, Heading2, Label } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";

type Props = {
  meta: ElectionMeta;
  scope: ElectionScope;
  turnout?: ElectionTurnout;
};

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
)(({ meta, scope, turnout, classes }) => {
  return (
    <>
      <Heading2>Prezența la vot</Heading2>
      <div>
        <Label>{getScopeName(scope)}</Label>
        {turnout == null && (
          <div className={classes.unavailable}>
            <BodyHuge>Nu există date despre prezența la vot pentru acest nivel de detaliu.</BodyHuge>
          </div>
        )}
        {turnout && turnout.eligibleVoters != null && (
          <ElectionTurnoutBars
            className={classes.percentageBars}
            eligibleVoters={turnout.eligibleVoters}
            totalVotes={turnout.totalVotes}
          />
        )}
      </div>
    </>
  );
});
