import React from "react";
import { ElectionTurnoutBreakdown } from "../../types/Election";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { themable } from "../../util/theme";
import { BarChart } from "../BarChart/BarChart";
import { PercentageBarsLegend } from "../PercentageBarsLegend/PercentageBarsLegend";
import cssClasses from "./ElectionTurnoutBreakdownChart.module.scss";
import useDimensions from "react-use-dimensions";

type Props = {
  value: ElectionTurnoutBreakdown;
  width?: number;
};

const categoryColors = {
  permanent_lists: "#55505C",
  supplementary_lists: "#5D737E",
  mobile_ballot_box: "#7FC6A4",
  vote_by_post: "#F1C692",
  default: "#55505C",
};

const categoryLabels = {
  permanent_lists: "Votanți liste permanente",
  supplementary_lists: "Votanți liste suplimentare",
  mobile_ballot_box: "Votanți urnă mobilă",
  vote_by_post: "Votanți prin corespondență",
  default: "Categorie necunoscută",
};

const breakdownTypeLabels = {
  national: "România",
  diaspora: "Diaspora",
};

const adjustScale = (x: number) => {
  let div = 10;
  while (x * 10 > div) {
    x = Math.ceil(x / div) * div;
    div *= 10;
  }
  return x;
};

export const ElectionTurnoutBreakdownChart = themable<Props>(
  "ElectionTurnoutBreakdownChart",
  cssClasses,
)(({ classes, value }) => {
  const [ref, { width }] = useDimensions();
  return (
    <div className={classes.root}>
      <div className={classes.chartRow}>
        {value.type !== "all" && (
          <div className={classes.infoRow}>
            <div className={classes.typeLabel}>{breakdownTypeLabels[value.type]}</div>
            <div style={{ backgroundColor: "#FFCC00", flex: 1, alignSelf: "stretch" }} />
          </div>
        )}
        <div className={classes.chartContainer} ref={ref}>
          <BarChart
            className={classes.chart}
            width={width ?? 1}
            yMax={
              value.total ?? adjustScale(value.categories.reduce((acc, category) => Math.max(acc, category.votes), 0))
            }
            renderLabel={value.total != null ? (x) => formatPercentage(x / value.total) : formatGroupedNumber}
            bars={value.categories.map(({ votes, type: categoryType }) => ({
              value: votes,
              color: categoryColors[categoryType] ?? categoryColors.default,
            }))}
          />
        </div>
      </div>
      <PercentageBarsLegend
        items={value.categories.map(({ votes, type: categoryType }) => ({
          legendName: categoryLabels[categoryType] ?? categoryColors.default,
          legendColor: categoryColors[categoryType] ?? categoryColors.default,
          legendValueLabel: value.total != null ? formatPercentage(votes / value.total) : formatGroupedNumber(votes),
          legendNote: value.total != null && `(${formatGroupedNumber(votes)})`,
        }))}
      />
    </div>
  );
});
