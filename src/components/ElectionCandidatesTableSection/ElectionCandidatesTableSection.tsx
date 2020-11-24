import React from "react";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import { ElectionResultsPartyCandidates } from "../../types/Election";
import { themable } from "../../hooks/theme";
import { ElectionPartyRow } from "../ElectionPartyRow/ElectionPartyRow";
import cssClasses from "./ElectionCandidatesTableSection.module.scss";

type Props = {
  heading: string;
  parties: ElectionResultsPartyCandidates[] | undefined;
};

export const ElectionCandidatesTableSection = themable<Props>(
  "ElectionCandidatesTableSection",
  cssClasses,
)(({ heading, parties }) => (
  <div className={cssClasses.tableContainer}>
    <ResultsTable className={cssClasses.table}>
      <thead>
        <tr>
          <th className={cssClasses.heading}>{heading}</th>
        </tr>
      </thead>
      <tbody>
        {parties &&
          parties.map((party, index) => (
            <ElectionPartyRow key={index} name={party.name} candidates={party.candidates} />
          ))}
      </tbody>
    </ResultsTable>
  </div>
));
