import React, { useMemo } from "react";
import { ElectionBallotMeta, ElectionResults } from "../../types/Election";
import { themable } from "../../hooks/theme";
import { HorizontalStackedBar, HorizontalStackedBarItem } from "../HorizontalStackedBar/HorizontalStackedBar";
import { PartyResultCard } from "../PartyResultCard/PartyResultCard";
import { PartyResultInline } from "../PartyResultInline/PartyResultInline";
import { useDimensions } from "../../hooks/useDimensions";
import { electionCandidateColor, fractionOf } from "../../util/format";
import cssClasses from "./ElectionResultsStackedBar.module.scss";

type Props = {
  results: ElectionResults;
  meta?: ElectionBallotMeta | null;
};

const defaultConstants = {
  neutralColor: "#B5B5B5",
  maxStackedBarItems: 4,
  breakpoint1: 850,
  breakpoint2: 700,
  breakpoint3: 330,
};

export const ElectionResultsStackedBar = themable<Props>(
  "ElectionResultsStackedBar",
  cssClasses,
  defaultConstants,
)(({ classes, results, constants, meta }) => {
  const { candidates } = results;
  const { neutralColor, maxStackedBarItems, breakpoint1, breakpoint2, breakpoint3 } = constants;

  const [stackedBarItems, legendItems] = useMemo(() => {
    const items: (HorizontalStackedBarItem & {
      name: string;
      percent: number;
      logo?: string | null;
      index: number;
    })[] = [];

    const percentageBasis = meta?.type === "referendum" ? results.eligibleVoters ?? 0 : results.validVotes;

    const stackedBarCount = candidates.length === maxStackedBarItems + 1 ? maxStackedBarItems + 1 : maxStackedBarItems;
    for (let i = 0; i < stackedBarCount; i++) {
      const candidate = candidates[i];
      if (candidate) {
        const color = electionCandidateColor(candidate);
        const percent = fractionOf(candidate.votes, percentageBasis);
        items.push({
          name: candidate.shortName ?? candidate.name,
          color,
          value: candidate.votes,
          percent,
          logo: candidate.partyLogo,
          index: items.length,
        });
      }
    }

    if (candidates.length > stackedBarCount) {
      let total = 0;
      for (let i = stackedBarCount; i < candidates.length; i++) {
        total += candidates[i].votes;
      }
      items.push({
        value: total,
        color: constants.neutralColor,
        name: "Alții",
        percent: fractionOf(total, results.validVotes),
        index: items.length,
      });
    }

    const stackItems = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      stackItems[i % 2 ? items.length - 1 - (i >> 1) : i >> 1] = items[i];
    }

    return [stackItems, items];
  }, [candidates, neutralColor, maxStackedBarItems, breakpoint1, breakpoint2, breakpoint3]);

  const [measureRef, { width = Infinity }] = useDimensions();

  if (candidates.length === 0) {
    return null;
  }

  return (
    <div className={classes.root} ref={measureRef}>
      <div className={classes.cards}>
        {stackedBarItems.map(
          (item, index) =>
            (width >= breakpoint2 || item.index < 2) && (
              <PartyResultCard
                key={item.index}
                name={item.name}
                color={item.color}
                percentage={item.percent}
                iconUrl={(width >= breakpoint1 || item.index < 2) && width >= breakpoint3 ? item.logo : undefined}
                rightAligned={index === stackedBarItems.length - 1}
              />
            ),
        )}
      </div>
      <HorizontalStackedBar items={stackedBarItems} />
      <div className={classes.legend}>
        {legendItems.map((item) => (
          <PartyResultInline
            key={item.index}
            className={classes.legendItem}
            name={item.name}
            color={item.color}
            votes={item.value}
            percentage={item.percent}
          />
        ))}
      </div>
    </div>
  );
});
