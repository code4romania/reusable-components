import React, { PropsWithChildren, ReactNode } from "react";
import { ElectionResults } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { ClassNames, themable } from "../../util/theme";
import { DivBodyHuge, Heading2 } from "../Typography/Typography";
import cssClasses from "./ElectionResultsProcess.module.scss";
import BallotFillIn from "../../assets/ballot-fill-in.svg";
import Citizens from "../../assets/citizens.svg";
import CitizensBuilding from "../../assets/citizens-building.svg";
import VoteByMail from "../../assets/vote-by-mail.svg";
import NullTimes from "../../assets/null-times.svg";

type Props = {
  results: ElectionResults;
};

const ShowcaseItem: React.FC<PropsWithChildren<{ classes: ClassNames; icon: ReactNode; value: number }>> = ({
  classes,
  icon,
  value,
  children,
}) => (
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
      {results.eligibleVoters != null && (
        <ShowcaseItem classes={classes} icon={<Citizens />} value={results.eligibleVoters}>
          Total alegători înscriși în liste
        </ShowcaseItem>
      )}
      {results.votesByMail != null && (
        <ShowcaseItem classes={classes} icon={<VoteByMail />} value={results.votesByMail}>
          Total voturi prin corespondență
        </ShowcaseItem>
      )}
      <ShowcaseItem classes={classes} icon={<CitizensBuilding />} value={results.totalVotes}>
        Total alegători prezenți la urne
      </ShowcaseItem>
      <ShowcaseItem classes={classes} icon={<BallotFillIn />} value={results.validVotes}>
        Total voturi valabil exprimate
      </ShowcaseItem>
      <ShowcaseItem classes={classes} icon={<NullTimes />} value={results.nullVotes}>
        Total voturi nule
      </ShowcaseItem>
    </div>
  );
});
