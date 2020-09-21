import React from "react";
import cssClasses from "./PartyResultCard.module.scss";
import { mergeClasses, themable } from "../../hooks/theme";
import { formatPercentage } from "../../util/format";
import { DivBodyMedium, DivHeading1 } from "../Typography/Typography";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";

type Props = {
  name: string;
  color: string;
  percentage: number;
  rightAligned?: boolean;
  iconUrl?: string;
};

export const PartyResultCard = themable<Props>(
  "PartyResultCard",
  cssClasses,
)(({ classes, name, color, percentage, rightAligned, iconUrl }) => (
  <div className={mergeClasses(classes.root, rightAligned && classes.rightAlign)}>
    {iconUrl && <img className={classes.icon} src={iconUrl} alt={name} />}
    <div className={classes.column}>
      <DivBodyMedium className={classes.nameRow}>
        <ColoredSquare className={classes.square} color={color} />
        <div className={classes.name}>{name}</div>
      </DivBodyMedium>
      <DivHeading1 className={classes.percentage}>{formatPercentage(percentage)}</DivHeading1>
    </div>
  </div>
));
