import React, { useCallback, useState } from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { themable } from "../../hooks/theme";
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
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const canCollapse = candidates && candidates.length >= 20;

  const onToggleCollapsed = useCallback(() => {
    setCollapsed((x) => !x);
  }, []);
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
                (!(canCollapse && collapsed) || index < 10) && (
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
          {collapsed ? "Afișează toate rezultatele" : "Ascunde toate rezultatele"}
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
