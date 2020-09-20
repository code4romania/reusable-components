import React, { useCallback, useState } from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { Heading2 } from "../Typography/Typography";
import { electionHasSeats, ElectionMeta, ElectionResults, ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber, formatPercentage, fractionOf } from "../../util/format";
import { ClassNames, themable } from "../../util/theme";
import cssClasses from "./ElectionResultsTableSection.module.scss";
import { Button } from "../Button/Button";

type Props = {
  meta: ElectionMeta;
  results: ElectionResults;
};

const CandidateTable: React.FC<{
  classes: ClassNames;
  validVotes: number;
  candidates: ElectionResultsCandidate[];
  hasSeats: boolean;
}> = ({ classes, validVotes, candidates, hasSeats }) => {
  const hasSeatsGained = hasSeats && candidates.reduce((acc, candidate) => acc || candidate.seatsGained != null, false);
  const hasCandidateCount = candidates.reduce((acc, candidate) => acc || candidate.candidateCount != null, false);

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const canCollapse = candidates.length >= 8;

  const onToggleCollapsed = useCallback(() => {
    setCollapsed((x) => !x);
  }, []);

  return (
    <div className={classes.tableContainer}>
      <ResultsTable className={classes.table}>
        <thead>
          <tr>
            <th>Partid / Alianță / Candidat independent</th>
            {hasCandidateCount && <th>Nr. cand.</th>}
            <th>Voturi</th>
            <th>%</th>
            {hasSeats && <th>Mandate</th>}
            {hasSeatsGained && <th>+/-</th>}
          </tr>
        </thead>
        <tbody>
          {candidates.map(
            (candidate, index) =>
              (!(canCollapse && collapsed) || index < 5) && (
                <tr key={index}>
                  <td className={classes.nameCell}>{candidate.name}</td>
                  {hasCandidateCount && <th>{formatGroupedNumber(candidate.candidateCount || 0)}</th>}
                  <td>{formatGroupedNumber(candidate.votes)}</td>
                  <td>{formatPercentage(fractionOf(candidate.votes, validVotes))}</td>
                  {hasSeats && <td>{formatGroupedNumber(candidate.seats || 0)}</td>}
                  {hasSeatsGained && (
                    <td>
                      {typeof candidate.seatsGained === "number"
                        ? formatGroupedNumber(candidate.seatsGained)
                        : candidate.seatsGained === "new"
                        ? "Nou"
                        : candidate.seatsGained}
                    </td>
                  )}
                </tr>
              ),
          )}
        </tbody>
      </ResultsTable>
      {canCollapse && (
        <Button className={classes.collapseButton} onClick={onToggleCollapsed}>
          {collapsed ? "Afișează toți candidații" : "Ascunde toți candidații"}
        </Button>
      )}
    </div>
  );
};

export const ElectionResultsTableSection = themable<Props>(
  "ElectionResultsTableSection",
  cssClasses,
)(({ classes, results, meta }) => {
  const hasSeats = electionHasSeats(meta.type, results);

  const qualified = hasSeats
    ? results.candidates.filter((cand) => Number.isFinite(cand.seats) && (cand.seats || 0) > 0)
    : results.candidates;

  const unqualified = hasSeats
    ? results.candidates.filter((cand) => !Number.isFinite(cand.seats) || (cand.seats || 0) <= 0)
    : null;

  if (unqualified && unqualified.length > 0) {
    return (
      <>
        <Heading2 className={classes.heading}>Partide care au îndeplinit pragul electoral</Heading2>
        <CandidateTable classes={classes} candidates={qualified} hasSeats={hasSeats} validVotes={results.validVotes} />
        <Heading2 className={classes.heading}>Partide care nu au îndeplinit pragul electoral</Heading2>
        <CandidateTable classes={classes} candidates={unqualified} hasSeats={false} validVotes={results.validVotes} />
      </>
    );
  }

  return (
    <CandidateTable classes={classes} candidates={qualified} hasSeats={hasSeats} validVotes={results.validVotes} />
  );
});
