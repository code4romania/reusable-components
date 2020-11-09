import React from "react";
import {
  electionHasSeats,
  ElectionBallotMeta,
  ElectionResults,
  ElectionType,
  ElectionScopeIncomplete,
  electionResultsDisplayVotes,
  electionResultsInterpretVotesAsSeats,
} from "../../types/Election";
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
  scope: ElectionScopeIncomplete;
  headers?: ElectionResultsSummaryTableHeaders;
};

type CellProps = {
  title?: string;
};

const THeadRow = makeTypographyComponent("th", "label");
const TCell = makeTypographyComponent<CellProps>("td", "bodyMedium");

const seatsDefaultHeader = (type: ElectionType) =>
  type === "mayor" ? "Nr. Primari" : type === "county_council_president" ? "Nr. Presedinti" : "Mand.";

export const ElectionResultsSummaryTable = themable<Props>(
  "ElectionResultsSummaryTable",
  cssClasses,
)(({ classes, results, meta, headers, scope }) => {
  const isReferendum = meta.type === "referendum";

  const showVotes = electionResultsDisplayVotes(scope, meta.type);
  const votesAsSeats = electionResultsInterpretVotesAsSeats(scope, meta.type);
  const percentageBasis = showVotes ? (isReferendum ? results.eligibleVoters ?? 0 : results.validVotes) : 0;
  const hasSeats = votesAsSeats || electionHasSeats(meta.type, results);

  const maxFraction = showVotes
    ? results.candidates.reduce((acc, cand) => Math.max(acc, fractionOf(cand.votes, percentageBasis)), 0)
    : 0;

  const percentages = showVotes
    ? results.candidates.map((candidate) => {
        return fractionOf(candidate.votes, percentageBasis);
      })
    : [];

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
              {hasSeats && <THeadRow>{headers?.seats ?? seatsDefaultHeader(meta.type)}</THeadRow>}
              {showVotes && <THeadRow>{headers?.votes ?? "Voturi"}</THeadRow>}
              {showVotes && <THeadRow className={classes.percentage}>{headers?.percentage ?? "%"}</THeadRow>}
              {showVotes && <THeadRow>{headers?.bar ?? ""}</THeadRow>}
            </tr>
          </thead>
          <tbody>
            {results.candidates.map((candidate, index) => (
              <tr key={index}>
                <TCell className={classes.name} title={candidate.shortName || candidate.name}>
                  <ColoredSquare color={electionCandidateColor(candidate)} className={classes.square} />
                  {candidate.shortName || candidate.name}
                </TCell>
                {hasSeats && (
                  <TCell>
                    {candidate.seats != null && formatGroupedNumber(votesAsSeats ? candidate.votes : candidate.seats)}
                  </TCell>
                )}
                {showVotes && <TCell>{formatGroupedNumber(candidate.votes)}</TCell>}
                {showVotes && <TCell className={classes.percentage}>{formatPercentage(percentages[index])}</TCell>}
                {showVotes && (
                  <td className={classes.barContainer}>
                    <div
                      className={classes.bar}
                      style={{
                        width: `${100 * fractionOf(percentages[index], maxFraction)}%`,
                        backgroundColor: electionCandidateColor(candidate),
                      }}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
