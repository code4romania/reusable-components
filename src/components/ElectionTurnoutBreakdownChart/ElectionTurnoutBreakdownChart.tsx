import React from "react";
import { ElectionScope, ElectionTurnoutBreakdown } from "../../types/Election";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { themable } from "../../util/theme";
import { BarChart } from "../BarChart/BarChart";
import { PercentageBarsLegend } from "../PercentageBarsLegend/PercentageBarsLegend";
import cssClasses from "./ElectionTurnoutBreakdownChart.module.scss";
import useDimensions from "react-use-dimensions";
import WorldMap from "../../assets/world-map.svg";
import RomaniaMap from "../../assets/romania-map.svg";

type Props = {
  value: ElectionTurnoutBreakdown;
  scope?: ElectionScope | null;
};

const categoryColors = {
  permanent_lists: "#55505C",
  supplementary_lists: "#5D737E",
  mobile_ballot_box: "#7FC6A4",
  vote_by_mail: "#F1C692",
  default: "#55505C",
};

const categoryLabels = {
  permanent_lists: "Votanți liste permanente",
  supplementary_lists: "Votanți liste suplimentare",
  mobile_ballot_box: "Votanți urnă mobilă",
  vote_by_mail: "Votanți prin corespondență",
  default: "Categorie necunoscută",
};

const breakdownTypeLabels = {
  national: "România",
  diaspora: "Diaspora",
  all: "",
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
)(({ classes, value, scope }) => {
  const [ref, { width }] = useDimensions();

  let type = value.type;
  if (type === "all" && scope) {
    if (scope.type === "national") {
      type = "national";
    } else if (scope.type === "diaspora") {
      type = "diaspora";
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.chartRow}>
        {type !== "all" && (
          <div className={classes.infoRow}>
            <div className={classes.typeLabel}>{breakdownTypeLabels[value.type]}</div>
            <div className={classes.mapIconContainer}>
              {type === "diaspora" && <WorldMap className={classes.worldMapIcon} />}
              {type === "national" && <RomaniaMap className={classes.romaniaMapIcon} />}
            </div>
          </div>
        )}
        <div className={classes.chartContainer} ref={ref}>
          <BarChart
            className={classes.chart}
            width={width ?? 1}
            yMax={
              value.total ?? adjustScale(value.categories.reduce((acc, category) => Math.max(acc, category.votes), 0))
            }
            renderLabel={value.total != null ? (x) => formatPercentage(x / (value.total || 0)) : formatGroupedNumber}
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
