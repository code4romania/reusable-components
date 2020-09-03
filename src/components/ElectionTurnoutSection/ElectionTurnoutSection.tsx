import React from "react";
import { DIASPORA, ElectionMeta, ElectionScope, ElectionTurnout } from "../../types/Election";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { themable, useTheme } from "../../util/theme";
import { PercentageBars } from "../PercentageBars/PercentageBars";
import { PercentageBarsLegend } from "../PercentageBarsLegend/PercentageBarsLegend";
import { BodyHuge, Heading2, Label } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";

type Props = {
  meta: ElectionMeta;
  scope: ElectionScope;
  turnout?: ElectionTurnout;
};

function getScopeName(scope: ElectionScope) {
  switch (scope.type) {
    case "national":
      return "Nivel Național";
    case "county":
      return scope.county === DIASPORA ? "Diaspora" : `Județul ${scope.county}`;
    case "uat":
      return scope.county === DIASPORA
        ? `Diaspora din ${scope.uat}`
        : `Unitatea administrativ-teritorială ${scope.uat}`;
    case "city":
      return `Localitatea ${scope.city}`;
  }
}

const ElectionTurnoutBars = ({ classes, eligibleVoters, totalVotes }) => {
  const theme = useTheme();
  const voterRatio = totalVotes / eligibleVoters;
  const items = [
    {
      color: theme.colors.primary,
      legendName: "Cetățeni cu drept de vot",
      value: 1,
      valueLabel: formatPercentage(1),
      legendNote: `(${formatGroupedNumber(eligibleVoters)})`,
    },
    {
      color: theme.colors.secondary,
      legendName: "Au votat",
      value: voterRatio,
      valueLabel: formatPercentage(voterRatio),
      legendNote: `(${formatGroupedNumber(totalVotes)})`,
    },
  ];
  return (
    <>
      <PercentageBars className={classes.percentageBars} total={1} items={items} />
      <PercentageBarsLegend items={items} />
    </>
  );
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
            classes={classes}
            eligibleVoters={turnout.eligibleVoters}
            totalVotes={turnout.totalVotes}
          />
        )}
      </div>
    </>
  );
});
