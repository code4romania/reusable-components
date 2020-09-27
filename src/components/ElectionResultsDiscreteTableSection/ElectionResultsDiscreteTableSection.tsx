import React from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { themable } from "../../hooks/theme";
import classes from "./ElectionResultsDiscreteTableSection.module.scss";

type Props = {
  candidates: ElectionResultsCandidate[];
  heading: string;
};

const CandidateTable: React.FC<{
  candidates: ElectionResultsCandidate[];
  heading: string;
}> = ({ candidates, heading }) => {
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
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td className={classes.nameCell}>{candidate.name}</td>
              <td>{formatGroupedNumber(candidate.votes)}</td>
            </tr>
          ))}
        </tbody>
      </ResultsTable>
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
