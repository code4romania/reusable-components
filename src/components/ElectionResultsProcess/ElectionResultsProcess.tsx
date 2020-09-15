import React from "react";
import { ElectionResults } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { themable } from "../../util/theme";
import { DivBodyHuge, DivBodyLarge, Heading2 } from "../Typography/Typography";
import cssClasses from "./ElectionResultsProcess.module.scss";
import BallotDrop from "../../assets/ballot-drop.svg";

type Props = {
  results: ElectionResults;
};

const ShowcaseItem = ({ classes, icon, value, children }) => (
  <div className={classes.showcaseItem}>
    <div className={classes.showcaseIcon}>{icon}</div>
    <div className={classes.showcaseContainer}>
      <Heading2 className={classes.showcaseValue}>{formatGroupedNumber(value)}</Heading2>
      <DivBodyHuge className={classes.showcaseText}>{children}</DivBodyHuge>
    </div>
  </div>
);

export const ElectionResultsProcess = themable<Props>(
  "ElectionResultsProcess",
  cssClasses,
)(({ results, classes }) => {
  return (
    <div className={classes.root}>
      <Heading2>ProcesulElectoral</Heading2>
      <div className={classes.showcase}>
        {results.eligibleVoters != null && (
          <ShowcaseItem classes={classes} icon={<BallotDrop />} value={results.eligibleVoters}>
            Total alegători înscriși în liste
          </ShowcaseItem>
        )}
        {results.votesByMail != null && (
          <ShowcaseItem classes={classes} icon={<BallotDrop />} value={results.votesByMail}>
            Total voturi prin corespondență
          </ShowcaseItem>
        )}
        <ShowcaseItem classes={classes} icon={<BallotDrop />} value={results.totalVotes}>
          Total alegători prezenți la urne
        </ShowcaseItem>
        <ShowcaseItem classes={classes} icon={<BallotDrop />} value={results.validVotes}>
          Total voturi valabil exprimate
        </ShowcaseItem>
        <ShowcaseItem classes={classes} icon={<BallotDrop />} value={results.nullVotes}>
          Total voturi nule
        </ShowcaseItem>
      </div>
    </div>
  );
});
