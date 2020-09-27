import React from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { Heading2 } from "../Typography/Typography";
import { ElectionResultsCandidate } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { ClassNames, themable } from "../../hooks/theme";
import cssClasses from "./ElectionResultsDiscreteTableSection.module.scss";

type Props = {
  candidates: ElectionResultsCandidate[];
  classes: ClassNames;
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
            <th>Voturi</th>
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
      <Heading2 className={classes.heading}>Rezultate electorale</Heading2>
      <CandidateTable classes={classes} candidates={candidates} />
    </>
  );
});
