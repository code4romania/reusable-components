import React, { useCallback, useMemo, useState } from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { Heading2 } from "../Typography/Typography";
import {
  electionHasSeats,
  ElectionBallotMeta,
  ElectionResults,
  ElectionResultsCandidate,
  electionResultsInterpretVotesAsSeats,
  ElectionScopeIncomplete,
  electionResultsDisplayVotes,
} from "../../types/Election";
import { formatGroupedNumber, formatPercentage, fractionOf } from "../../util/format";
import { ClassNames, themable } from "../../hooks/theme";
import { Button } from "../Button/Button";
import cssClasses from "./ElectionResultsTableSection.module.scss";

type Props = {
  meta: ElectionBallotMeta;
  results: ElectionResults;
  scope: ElectionScopeIncomplete;
};

const CandidateTable: React.FC<{
  classes: ClassNames;
  validVotes: number;
  candidates: ElectionResultsCandidate[];
  hasSeats: boolean;
  hasVotes: boolean;
  votesAsSeats: boolean;
  meta: ElectionBallotMeta;
}> = ({ classes, validVotes, candidates, hasSeats, hasVotes, votesAsSeats, meta }) => {
  const hasSeatsGained = hasSeats && candidates.reduce((acc, candidate) => acc || candidate.seatsGained != null, false);
  const hasCandidateCount = candidates.reduce((acc, candidate) => acc || candidate.candidateCount != null, false);

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const canCollapse = candidates.length >= 8;

  const onToggleCollapsed = useCallback(() => {
    setCollapsed((x) => !x);
  }, []);

  if (meta && meta.type === "referendum") {
    return null;
  }

  return (
    <div className={classes.tableContainer}>
      <ResultsTable className={classes.table}>
        <thead>
          <tr>
            <th>Partid / Alianță / Candidat independent</th>
            {hasCandidateCount && <th>Nr. cand.</th>}
            {hasVotes && <th>Voturi</th>}
            {hasVotes && <th>%</th>}
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
                  {hasVotes && <td>{formatGroupedNumber(candidate.votes)}</td>}
                  {hasVotes && <td>{formatPercentage(fractionOf(candidate.votes, validVotes))}</td>}
                  {hasSeats && <td>{formatGroupedNumber((votesAsSeats ? candidate.votes : candidate.seats) || 0)}</td>}
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

const emptyToNull = <T,>(x: Array<T> | null) => (x && x.length >= 1 ? x : null);

export const ElectionResultsTableSection = themable<Props>(
  "ElectionResultsTableSection",
  cssClasses,
)(({ classes, results, meta, scope }) => {
  const votesAsSeats = electionResultsInterpretVotesAsSeats(scope, meta.type);
  const hasVotes = electionResultsDisplayVotes(scope, meta.type);

  const [qualified, unqualified, hasSeats] = useMemo(() => {
    const hasSeats_ = votesAsSeats || electionHasSeats(meta.type, results);

    const qualified_ = hasSeats_
      ? results.candidates.filter((cand) => {
          const seats = votesAsSeats ? cand.votes : cand.seats;
          return Number.isFinite(seats) && (seats || 0) > 0;
        })
      : results.candidates;

    const unqualified_ = hasSeats_
      ? results.candidates.filter((cand) => {
          const seats = votesAsSeats ? cand.votes : cand.seats;
          return !Number.isFinite(seats) || (seats || 0) <= 0;
        })
      : null;

    return [emptyToNull(qualified_), emptyToNull(unqualified_), hasSeats_];
  }, [results, meta.type]);

  if (!qualified && !unqualified) {
    return null;
  }

  if (meta && meta.type === "referendum") {
    return null;
  }

  if (qualified && unqualified) {
    return (
      <>
        <Heading2 className={classes.heading}>Partide care au îndeplinit pragul electoral</Heading2>
        <CandidateTable
          classes={classes}
          candidates={qualified}
          hasSeats={hasSeats}
          hasVotes={hasVotes}
          validVotes={results.validVotes}
          votesAsSeats={votesAsSeats}
          meta={meta}
        />
        <Heading2 className={classes.heading}>Partide care nu au îndeplinit pragul electoral</Heading2>
        <CandidateTable
          classes={classes}
          candidates={unqualified}
          hasSeats={false}
          hasVotes={hasVotes}
          validVotes={results.validVotes}
          votesAsSeats={votesAsSeats}
          meta={meta}
        />

        <p>
          * Numărul final de mandate obţinute de fiecare formaţiune politică va fi afişat după finalizarea procesului de
          distribuire şi redistribuire a mandatelor de către birourile electorale.
        </p>
      </>
    );
  }

  return (
    <>
      <CandidateTable
        classes={classes}
        candidates={qualified || unqualified || []}
        hasSeats={hasSeats}
        hasVotes={hasVotes}
        validVotes={results.validVotes}
        votesAsSeats={votesAsSeats}
        meta={meta}
      />

      <p>
        * Numărul final de mandate obţinute de fiecare formaţiune politică va fi afişat după finalizarea procesului de
        distribuire şi redistribuire a mandatelor de către birourile electorale.
      </p>
    </>
  );
});
