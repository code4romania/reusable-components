import React from "react";
import {
  ElectionMeta,
  ElectionScopeResolved,
  ElectionTurnout,
  electionTypeInvolvesDiaspora,
} from "../../types/Election";
import { formatPercentage, getScopeName } from "../../util/format";
import { mergeClasses, themable } from "../../util/theme";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { ElectionTurnoutBars } from "../ElectionTurnoutBars/ElectionTurnoutBars";
import { ElectionTurnoutBreakdownChart } from "../ElectionTurnoutBreakdownChart/ElectionTurnoutBreakdownChart";
import { BodyHuge, Heading2, Label } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";
import useDimensions from "react-use-dimensions";

type Props = {
  meta: ElectionMeta;
  scope: ElectionScopeResolved;
  turnout?: ElectionTurnout;
};

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
)(({ meta, scope, turnout, classes }) => {
  const involvesDiaspora = electionTypeInvolvesDiaspora(meta.type);

  const [measureRef, { width }] = useDimensions();

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
  const mobileMap = width != null && width <= 480;
  const fullWidthMap =
    !mobileMap && width != null && width <= (scope.type === "national" && involvesDiaspora ? 1000 : 840);

  return (
    <>
      {mobileMap && map}
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
        <div style={{ width: "100%" }} ref={measureRef} />
        <div
          className={mergeClasses(
            mergeClasses(classes.mapBreakdownContainer, fullWidthMap && classes.mapBreakdownContainerFullWidth),
            mobileMap && classes.mapBreakdownContainerMobile,
          )}
        >
          {turnout && turnout.breakdown && turnout.breakdown.length > 0 && (
            <div className={classes.breakdownContainer}>
              {turnout.breakdown.map((breakdown, index) => (
                <ElectionTurnoutBreakdownChart
                  key={index}
                  className={classes.breakdown}
                  value={breakdown}
                  scope={scope}
                />
              ))}
            </div>
          )}
          {!mobileMap && map}
        </div>
      </div>
    </>
  );
});
