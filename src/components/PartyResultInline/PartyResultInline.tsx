import React from "react";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { themable } from "../../util/theme";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import { DivBody, Label } from "../Typography/Typography";
import cssClasses from "./PartyResultInline.module.scss";

type Props = {
  name: string;
  color: string;
  percentage?: number;
  votes?: number;
};

export const PartyResultInline = themable<Props>(
  "PartyResultInline",
  cssClasses,
)(({ classes, name, color, percentage, votes }) => (
  <DivBody className={classes.root}>
    <ColoredSquare color={color} className={classes.square} />
    <div className={classes.text}>
      <span className={classes.name}>{name}</span>
      <Label className={classes.votes}>
        {percentage != null && votes != null && `${formatPercentage(percentage)} (${formatGroupedNumber(votes)})`}
        {percentage == null && votes != null && formatGroupedNumber(votes)}
        {percentage != null && votes == null && formatPercentage(percentage)}
      </Label>
    </div>
  </DivBody>
));
