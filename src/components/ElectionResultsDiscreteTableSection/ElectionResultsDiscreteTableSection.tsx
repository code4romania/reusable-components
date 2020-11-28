import React from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { themable } from "../../hooks/theme";
import { usePagination } from "../../hooks/usePagination";
import { Button } from "../Button/Button";
import classes from "./ElectionResultsDiscreteTableSection.module.scss";

type Props = {
  candidates: ElectionResultsCandidate[] | undefined;
  heading: string;
};

const CandidateTable: React.FC<{
  candidates: ElectionResultsCandidate[] | undefined;
  heading: string;
}> = ({ candidates, heading }) => {
  const candidatesCount = candidates?.length || 0;
  const { limit, buttonText, canCollapse, onToggleCollapsed } = usePagination({ total: candidatesCount, size: 10 });

  return (
    <div className={classes.tableContainer}>
      <ResultsTable className={classes.table}>
        <thead>
          <tr>
            <th>Partid / Alianță / Candidat independent</th>
            <th>{heading}</th>
          </tr>
        </thead>
        <tbody>
          {candidates &&
            candidates.map(
              (candidate, index) =>
                (!(canCollapse && limit) || index < limit) && (
                  <tr key={index}>
                    <td className={classes.nameCell}>{candidate.name}</td>
                    <td>{formatGroupedNumber(candidate.votes)}</td>
                  </tr>
                ),
            )}
        </tbody>
      </ResultsTable>
      {canCollapse && (
        <Button className={classes.collapseButton} onClick={onToggleCollapsed}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export const ElectionResultsDiscreteTableSection = themable<Props>("ElectionResultsDiscreteTableSection")(
  ({ candidates, heading }) => {
    return (
      <>
        <CandidateTable candidates={candidates} heading={heading} />
      </>
    );
  },
);
