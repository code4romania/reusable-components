import React, { useCallback, useState } from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsPartyCandidates } from "../../types/Election";
import { themable } from "../../hooks/theme";
import { Button } from "../Button/Button";
import { ElectionPartyRow } from "../ElectionPartyRow/ElectionPartyRow";
import classes from "./ElectionCandidatesTableSection.module.scss";

type Props = {
  parties: ElectionResultsPartyCandidates[] | undefined;
  heading: string;
};

const CandidateTable: React.FC<{
  parties: ElectionResultsPartyCandidates[] | undefined;
  heading: string;
}> = ({ parties, heading }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const canCollapse = parties && parties.length >= 12;

  const onToggleCollapsed = useCallback(() => {
    setCollapsed((x) => !x);
  }, []);

  return (
    <div className={classes.tableContainer}>
      <ResultsTable className={classes.table}>
        <thead>
          <tr>
            <th>{heading}</th>
          </tr>
        </thead>
        <tbody>
          {parties &&
            parties.map(
              (party, index) =>
                (!(canCollapse && collapsed) || index < 10) && (
                  <ElectionPartyRow key={index} name={party.name} candidates={party.candidates} />
                ),
            )}
        </tbody>
      </ResultsTable>
      {canCollapse && (
        <Button className={classes.collapseButton} onClick={onToggleCollapsed}>
          {collapsed ? "Afișează toate rezultatele" : "Ascunde rezultatele"}
        </Button>
      )}
    </div>
  );
};

export const ElectionCandidatesTableSection = themable<Props>("ElectionResultsCandidatesTableSection")(
  ({ parties, heading }) => {
    return (
      <>
        <CandidateTable parties={parties} heading={heading} />
      </>
    );
  },
);
