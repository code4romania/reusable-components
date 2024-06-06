import React, { ReactNode } from "react";
import {
  ElectionScopeIncomplete,
  ElectionScopeIncompleteResolved,
  electionScopeIsComplete,
  ElectionTurnout,
} from "../../types/Election";
import { formatGroupedNumber, formatPercentage, getScopeName } from "../../util/format";
import { mergeClasses, themable, useTheme } from "../../hooks/theme";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { ElectionTurnoutBars } from "../ElectionTurnoutBars/ElectionTurnoutBars";
import { ElectionTurnoutBreakdownChart } from "../ElectionTurnoutBreakdownChart/ElectionTurnoutBreakdownChart";
import { DivBodyHuge, Heading2, Label } from "../Typography/Typography";
import { useDimensions } from "../../hooks/useDimensions";
import BallotCheckmark from "../../assets/ballot-checkmark.svg";
import { ElectionScopeIncompleteWarning } from "../Warning/ElectionScopeIncompleteWarning";
import cssClasses from "./ElectionTurnoutSection.module.scss";

type Props = {
  scope: ElectionScopeIncompleteResolved;
  onScopeChange?: (scope: ElectionScopeIncomplete) => unknown;
  turnout?: ElectionTurnout | null;
  loader?: ReactNode;
};

const defaultConstants = {
  breakpoint1: 840,
  breakpoint2: 480,
};

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
  defaultConstants,
)(({ scope, onScopeChange, turnout, loader, classes, constants }) => {
  const [measureRef, { width }] = useDimensions();

  const completeness = electionScopeIsComplete(scope);
  const theme = useTheme();

  const map = width != null && (
    <ElectionMap
      scope={scope}
      onScopeChange={onScopeChange}
      className={classes.map}
      defaultColor={theme.colors.secondary}
    >
      {scope.type === "national" && turnout && turnout.eligibleVoters && (
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayPercentage}>
            {formatPercentage(turnout.totalVotes / turnout.eligibleVoters)}
          </div>
          <div className={classes.mapOverlayLabel}>Prezența la vot</div>
        </div>
      )}
    </ElectionMap>
  );

  const { breakpoint1, breakpoint2 } = constants;
  const mobileMap = width != null && width <= breakpoint2;
  const fullWidthMap = !mobileMap && width != null && width <= (scope.type === "national" && breakpoint1);

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
      {turnout == null &&
        completeness.complete &&
        (loader ? (
          loader
        ) : (
          <DivBodyHuge className={classes.warning}>
            Nu există date disponibile pentru această unitate administrativ teritorială.
          </DivBodyHuge>
        ))}
      {turnout &&
        turnout.eligibleVoters &&
        (turnout.eligibleVoters === turnout.totalVotes ? (
          <div className={mergeClasses(classes.percentageBars, classes.totalVotesContainer)}>
            <BallotCheckmark />
            <div className={classes.totalVotesLabels}>
              <div className={classes.totalVotesCount}>{formatGroupedNumber(turnout.totalVotes)}</div>
            </div>
          </div>
        ) : (
          <ElectionTurnoutBars
            className={classes.percentageBars}
            eligibleVoters={turnout.eligibleVoters}
            totalVotes={turnout.totalVotes}
          />
        ))}
      <div style={{ width: "100%" }} ref={measureRef} />
      <div
        className={mergeClasses(
          mergeClasses(classes.mapBreakdownContainer, fullWidthMap && classes.mapBreakdownContainerFullWidth),
          mobileMap && classes.mapBreakdownContainerMobile,
        )}
      >
        {turnout &&
          completeness.complete &&
          ((turnout.breakdown?.length ?? 0) > 0 || turnout.eligibleVoters == null) && (
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
