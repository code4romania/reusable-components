import React from "react";
import { electionHasSeats, ElectionBallotMeta, ElectionResults } from "../../types/Election";
import { themable } from "../../hooks/theme";
import { DivBody, Heading3, makeTypographyComponent } from "../Typography/Typography";
import { lightFormat, parseISO } from "date-fns";
import { electionCandidateColor, formatGroupedNumber, formatPercentage, fractionOf } from "../../util/format";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import cssClasses from "./ElectionResultsSummaryTable.module.scss";

export type ElectionResultsSummaryTableHeaders = {
  candidate?: string;
  seats?: string;
  votes?: string;
  percentage?: string;
  bar?: string;
};

type Props = {
  meta: ElectionBallotMeta;
  results: ElectionResults;
  headers?: ElectionResultsSummaryTableHeaders;
};

type CellProps = {
  title?: string;
};

const THeadRow = makeTypographyComponent("th", "label");
const TCell = makeTypographyComponent<CellProps>("td", "bodyMedium");

export const ElectionResultsSummaryTable = themable<Props>(
  "ElectionResultsSummaryTable",
  cssClasses,
)(({ classes, results, meta, headers }) => {
  const hasSeats = electionHasSeats(meta.type, results);
  const isReferendum = meta.type === "referendum";
  const percentageBasis = isReferendum ? results.eligibleVoters ?? 0 : results.validVotes;

  const maxFraction = results.candidates.reduce(
    (acc, cand) => Math.max(acc, fractionOf(cand.votes, percentageBasis)),
    0,
  );

  const percentages = results.candidates.map((candidate) => {
    return fractionOf(candidate.votes, percentageBasis);
  });

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
              <THeadRow>{headers?.candidate ?? (isReferendum ? "Opțiune" : "Partid")}</THeadRow>
              {hasSeats && <THeadRow>{headers?.seats ?? "Mand."}</THeadRow>}
              <THeadRow>{headers?.votes ?? "Voturi"}</THeadRow>
              <THeadRow className={classes.percentage}>{headers?.percentage ?? "%"}</THeadRow>
              <THeadRow>{headers?.bar ?? ""}</THeadRow>
            </tr>
          </thead>
          <tbody>
            {results.candidates.map((candidate, index) => (
              <tr key={index}>
                <TCell className={classes.name} title={candidate.shortName || candidate.name}>
                  <ColoredSquare color={electionCandidateColor(candidate)} className={classes.square} />
                  {candidate.shortName || candidate.name}
                </TCell>
                {hasSeats && <TCell>{candidate.seats != null && formatGroupedNumber(candidate.seats)}</TCell>}
                <TCell>{formatGroupedNumber(candidate.votes)}</TCell>
                <TCell className={classes.percentage}>{formatPercentage(percentages[index])}</TCell>
                <td className={classes.barContainer}>
                  <div
                    className={classes.bar}
                    style={{
                      width: `${100 * fractionOf(percentages[index], maxFraction)}%`,
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
