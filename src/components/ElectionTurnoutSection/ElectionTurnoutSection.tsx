import React from "react";
import {
  ElectionBallotMeta,
  ElectionScopeIncompleteResolved,
  electionScopeIsComplete,
  ElectionTurnout,
  electionTypeInvolvesDiaspora,
} from "../../types/Election";
import { formatGroupedNumber, formatPercentage, getScopeName } from "../../util/format";
import { mergeClasses, themable } from "../../util/theme";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { ElectionTurnoutBars } from "../ElectionTurnoutBars/ElectionTurnoutBars";
import { ElectionTurnoutBreakdownChart } from "../ElectionTurnoutBreakdownChart/ElectionTurnoutBreakdownChart";
import { DivBodyHuge, Heading2, Label } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";
import useDimensions from "react-use-dimensions";
import BallotCheckmark from "../../assets/ballot-checkmark.svg";
import { ElectionScopeIncompleteWarning } from "../Warning/ElectionScopeIncompleteWarning";

type Props = {
  meta: ElectionBallotMeta;
  scope: ElectionScopeIncompleteResolved;
  turnout?: ElectionTurnout | null;
};

const defaultConstants = {
  breakpoint1: 1000,
  breakpoint2: 840,
  breakpoint3: 480,
};

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
  defaultConstants,
)(({ meta, scope, turnout, classes, constants }) => {
  const involvesDiaspora = electionTypeInvolvesDiaspora(meta.type);

  const [measureRef, { width }] = useDimensions();

  const completeness = electionScopeIsComplete(scope);

  const map = width != null && (
    <ElectionMap scope={scope} involvesDiaspora={involvesDiaspora} className={classes.map}>
      {scope.type === "national" && turnout && turnout.eligibleVoters && (
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayPercentage}>
            {formatPercentage(turnout.totalVotes / turnout.eligibleVoters)}
          </div>
          <div className={classes.mapOverlayLabel}>Total prezență la vot în România și Diaspora</div>
        </div>
      )}
    </ElectionMap>
  );

  const { breakpoint1, breakpoint2, breakpoint3 } = constants;
  const mobileMap = width != null && width <= breakpoint3;
  const fullWidthMap =
    !mobileMap && width != null && width <= (scope.type === "national" && involvesDiaspora ? breakpoint1 : breakpoint2);

  const showHeading = turnout != null && completeness.complete;

  return (
    <>
      {mobileMap && map}
      {showHeading && (
        <>
          <Heading2>Prezența la vot</Heading2>
          <div>
            <Label>{getScopeName(scope)}</Label>
          </div>
        </>
      )}
      {!completeness.complete && (
        <ElectionScopeIncompleteWarning className={classes.warning} completeness={completeness} page="turnout" />
      )}
      {turnout == null && completeness.complete && (
        <DivBodyHuge className={classes.warning}>
          Nu există date despre prezența la vot pentru acest nivel de detaliu.
        </DivBodyHuge>
      )}
      {turnout && turnout.eligibleVoters != null && (
        <ElectionTurnoutBars
          className={classes.percentageBars}
          eligibleVoters={turnout.eligibleVoters}
          totalVotes={turnout.totalVotes}
        />
      )}
      <div style={{ width: "100%" }} ref={measureRef} />
      <div
        className={mergeClasses(
          mergeClasses(classes.mapBreakdownContainer, fullWidthMap && classes.mapBreakdownContainerFullWidth),
          mobileMap && classes.mapBreakdownContainerMobile,
        )}
      >
        {turnout && completeness.complete && ((turnout.breakdown?.length ?? 0) > 0 || turnout.eligibleVoters == null) && (
          <div className={classes.breakdownContainer}>
            {turnout.eligibleVoters == null && (
              <div className={mergeClasses(classes.breakdown, classes.totalVotesContainer)}>
                <BallotCheckmark />
                <div className={classes.totalVotesLabels}>
                  <div className={classes.totalVotesCount}>{formatGroupedNumber(turnout.totalVotes)}</div>
                  <div className={classes.totalVotesLabel}>Votanți {getScopeName(scope)}</div>
                </div>
              </div>
            )}
            {turnout.breakdown?.map((breakdown, index) => (
              <ElectionTurnoutBreakdownChart
                key={index}
                className={classes.breakdown}
                value={breakdown}
                scope={completeness.complete}
              />
            ))}
          </div>
        )}
        {!mobileMap && map}
      </div>
    </>
  );
});
