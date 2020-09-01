import React from "react";
import classes from "./PartyResultInline.module.scss";
import { NameWithColor } from "../NameWithColor/NameWithColor";

type Props = {
  name: string;
  color: string;
  percentage: string;
  votesCount: number;
};

export const PartyResultInline: React.FC<Props> = ({ name, color, percentage, votesCount }) => (
  <div className={classes.partyResultInline}>
    <NameWithColor color={color} text={name} />
    <div className={classes.votes}>
      {percentage}% ({votesCount})
    </div>
  </div>
);
