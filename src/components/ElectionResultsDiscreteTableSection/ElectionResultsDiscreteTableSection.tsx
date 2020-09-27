import React from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { ClassNames, themable } from "../../hooks/theme";
import cssClasses from "./ElectionResultsDiscreteTableSection.module.scss";

type Props = {
  candidates: ElectionResultsCandidate[];
  classes: ClassNames;
  heading: string;
};

const CandidateTable: React.FC<{
  classes: ClassNames;
  candidates: ElectionResultsCandidate[];
}> = ({ classes, candidates }) => {
  return (
    <div className={classes.tableContainer}>
      <ResultsTable className={classes.table}>
        <thead>
          <tr>
            <th>Partid / Alianță / Candidat independent</th>
            <th>heading</th>
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

export const ElectionResultsDiscreteTableSection = themable<Props>(
  "ElectionResultsDiscreteTableSection",
  cssClasses,
)(({ classes, candidates }) => {
  return (
    <>
      <CandidateTable classes={classes} candidates={candidates} />
    </>
  );
});
