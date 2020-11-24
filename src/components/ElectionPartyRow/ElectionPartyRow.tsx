import React, { useState, useCallback } from "react";
import { ElectionResultsPartyCandidate } from "../../types/Election";
import { themable, mergeClasses } from "../../hooks/theme";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import cssClasses from "./ElectionPartyRow.module.scss";

type Props = {
  name: string;
  candidates: ElectionResultsPartyCandidate[];
};

export const ElectionPartyRow = themable<Props>(
  "ElectionPartyRow",
  cssClasses,
)(({ name, candidates }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const onExpandClick = useCallback(() => {
    setExpanded((x) => !x);
  }, []);

  return (
    <>
      <tr
        className={expanded ? mergeClasses(cssClasses.party, cssClasses.expanded) : cssClasses.party}
        onClick={onExpandClick}
      >
        <td className={cssClasses.nameCell}>
          {name}
          <i className={cssClasses.chevron}></i>
        </td>
      </tr>
      {expanded ? (
        <ResultsTable>
          <tbody>
            {candidates.map((candidate: ElectionResultsPartyCandidate) => (
              <tr key={candidate.name} className={cssClasses.candidate}>
                <td>{candidate.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultsTable>
      ) : null}
    </>
  );
});
