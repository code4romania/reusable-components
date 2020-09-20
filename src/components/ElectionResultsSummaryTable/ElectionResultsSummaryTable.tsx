import React from "react";
import { electionHasSeats, ElectionBallotMeta, ElectionResults } from "../../types/Election";
import { themable } from "../../util/theme";
import cssClasses from "./ElectionResultsSummaryTable.module.scss";
import { DivBody, Heading3, makeTypographyComponent } from "../Typography/Typography";
import { lightFormat, parseISO } from "date-fns";
import { electionCandidateColor, formatGroupedNumber, formatPercentage, fractionOf } from "../../util/format";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";

type Props = {
  meta: ElectionBallotMeta;
  results: ElectionResults;
};

const THeadRow = makeTypographyComponent("th", "label");
const TCell = makeTypographyComponent("td", "bodyMedium");

export const ElectionResultsSummaryTable = themable<Props>(
  "ElectionResultsSummaryTable",
  cssClasses,
)(({ classes, results, meta }) => {
  const hasSeats = electionHasSeats(meta.type, results);
  const maxFraction = results.candidates.reduce(
    (acc, cand) => Math.max(acc, fractionOf(cand.votes, results.validVotes)),
    0,
  );

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {meta.ballot && <DivBody>{meta.title}</DivBody>}
        <Heading3>
          {meta.ballot || meta.title} {lightFormat(parseISO(meta.date), "yyyy")}
        </Heading3>
      </div>
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <thead>
            <tr>
              <THeadRow>Partid</THeadRow>
              {hasSeats && <THeadRow>Mand.</THeadRow>}
              <THeadRow>Voturi</THeadRow>
              <THeadRow className={classes.percentage}>%</THeadRow>
              <THeadRow></THeadRow>
            </tr>
          </thead>
          <tbody>
            {results.candidates.map((candidate, index) => (
              <tr key={index}>
                <TCell className={classes.name}>
                  <ColoredSquare color={electionCandidateColor(candidate)} className={classes.square} />
                  {candidate.shortName || candidate.name}
                </TCell>
                {hasSeats && <TCell>{candidate.seats != null && formatGroupedNumber(candidate.seats)}</TCell>}
                <TCell>{formatGroupedNumber(candidate.votes)}</TCell>
                <TCell className={classes.percentage}>
                  {formatPercentage(fractionOf(candidate.votes, results.validVotes))}
                </TCell>
                <td className={classes.barContainer}>
                  <div
                    className={classes.bar}
                    style={{
                      width: `${100 * fractionOf(fractionOf(candidate.votes, results.validVotes), maxFraction)}%`,
                      backgroundColor: electionCandidateColor(candidate),
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
