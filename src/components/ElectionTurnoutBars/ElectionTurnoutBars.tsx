import React from "react";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { themable, useTheme } from "../../hooks/theme";
import { PercentageBars } from "../PercentageBars/PercentageBars";
import { PercentageBarsLegend } from "../PercentageBarsLegend/PercentageBarsLegend";

type Props = {
  eligibleVoters: number;
  totalVotes: number;
};

export const ElectionTurnoutBars = themable<Props>("ElectionTurnoutBars")(({ classes, eligibleVoters, totalVotes }) => {
  const theme = useTheme();
  const voterRatio = totalVotes / eligibleVoters;
  const items = [
    {
      color: theme.colors.primary,
      labelColor: "#000000",
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
    <div className={classes.root}>
      <PercentageBars total={1} items={items} />
      <PercentageBarsLegend items={items} />
    </div>
  );
});
