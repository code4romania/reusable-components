import React, { PropsWithChildren, ReactNode } from "react";
import { ElectionObservation } from "../../types/Election";
import { formatGroupedNumber } from "../../util/format";
import { ClassNames, themable, useTheme } from "../../hooks/theme";
import { DivBodyLarge, Heading2 } from "../Typography/Typography";
import BallotDrop from "../../assets/ballot-drop.svg";
import RaisedHands from "../../assets/raised-hands.svg";
import RomaniaCountyMap from "../../assets/romania-county-map.svg";
import { PercentageBars } from "../PercentageBars/PercentageBars";
import { PercentageBarsLegend } from "../PercentageBarsLegend/PercentageBarsLegend";
import cssClasses from "./ElectionObservationSection.module.scss";

type Props = {
  observation: ElectionObservation;
};

const ShowcaseItem: React.FC<PropsWithChildren<{ classes: ClassNames; icon: ReactNode; value: number }>> = ({
  classes,
  icon,
  value,
  children,
}) => (
  <div className={classes.showcaseItem}>
    <div className={classes.showcaseIcon}>{icon}</div>
    <div className={classes.showcaseValue}>{formatGroupedNumber(value)}</div>
    <DivBodyLarge className={classes.showcaseText}>{children}</DivBodyLarge>
  </div>
);

export const ElectionObservationSection = themable<Props>(
  "ElectionObservationSection",
  cssClasses,
)(({ observation, classes }) => {
  const theme = useTheme();
  const items = [
    {
      color: theme.colors.primary,
      labelColor: "#000000",
      legendName: "Mesaje trimise de către observatori",
      value: observation.messageCount,
      valueLabel: formatGroupedNumber(observation.messageCount),
    },
    {
      color: theme.colors.secondary,
      legendName: "Probleme sesizate",
      value: observation.issueCount,
      valueLabel: formatGroupedNumber(observation.issueCount),
    },
  ];

  return (
    <div className={classes.root}>
      <Heading2>Observarea independentă a alegerilor</Heading2>
      <DivBodyLarge>
        Aceste date sunt colectate prin aplicația{" "}
        <a href="https://code4.ro/ro/monitorizare-vot" target="_blank" rel="noreferrer">
          Monitorizare Vot
        </a>
        , dezvoltată de{" "}
        <a href="https://code4.ro" target="_blank" rel="noreferrer">
          Code for Romania
        </a>
        , de la observatorii independenți acreditați în secțiile de votare acoperite.
      </DivBodyLarge>
      <div className={classes.showcase}>
        <ShowcaseItem classes={classes} icon={<BallotDrop />} value={observation.coveredPollingPlaces}>
          Secții de votare acoperite
        </ShowcaseItem>
        <ShowcaseItem classes={classes} icon={<RomaniaCountyMap />} value={observation.coveredCounties}>
          Județe acoperite
        </ShowcaseItem>
        <ShowcaseItem classes={classes} icon={<RaisedHands />} value={observation.observerCount}>
          Observatori logați în aplicație
        </ShowcaseItem>
      </div>
      <PercentageBars items={items} />
      <PercentageBarsLegend items={items} />
    </div>
  );
});
