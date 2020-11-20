import React, { useCallback, useState } from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsPartyCandidates } from "../../types/Election";
import { themable } from "../../hooks/theme";
import { Button } from "../Button/Button";
import { ElectionPartyRow } from "../ElectionPartyRow/ElectionPartyRow";
import classes from "./ElectionCandidatesTableSection.module.scss";

type Props = {
  heading: string;
  parties: ElectionResultsPartyCandidates[] | undefined;
  ballot: string;
};

const CandidateTable: React.FC<{
  heading: string;
  parties: ElectionResultsPartyCandidates[] | undefined;
  ballot: string;
}> = ({ heading, parties, ballot }) => {
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
            <th className={classes.heading}>{heading}</th>
          </tr>
        </thead>
        <tbody>
          {parties &&
            parties.map(
              (party, index) =>
                (!(canCollapse && collapsed) || index < 10) && (
                  <ElectionPartyRow key={index} name={party.name} candidates={party.candidates} ballot={ballot} />
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

export const ElectionCandidatesTableSection = themable<Props>("ElectionCandidatesTableSection")(
  ({ heading, parties, ballot }) => {
    return (
      <>
        <CandidateTable parties={parties} heading={heading} ballot={ballot} />
      </>
    );
  },
);
