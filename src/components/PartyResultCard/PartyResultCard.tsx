import React from "react";
import classes from "./PartyResultCard.module.scss";
import { NameWithColor } from "../NameWithColor/NameWithColor";

type Props = {
  name: string;
  color: string;
  percentage: number;
  rightAligned?: boolean;
};

export const PartyResultCard: React.FC<Props> = ({ name, color, percentage, rightAligned }) => (
  <div
    className={classes.partyResultCard}
    style={{
      alignItems: rightAligned ? "flex-end" : "flex-start",
    }}
  >
    <NameWithColor color={color} text={name} rightAligned={rightAligned} />
    <div className={classes.percentage}>{percentage}%</div>
  </div>
);
