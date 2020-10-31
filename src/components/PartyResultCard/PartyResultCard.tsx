import React from "react";
import { mergeClasses, themable } from "../../hooks/theme";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { DivBodyMedium, DivHeading1 } from "../Typography/Typography";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import cssClasses from "./PartyResultCard.module.scss";

type Props = {
  name: string;
  color: string;
  value: number;
  isPercentage?: boolean;
  rightAligned?: boolean;
  iconUrl?: string;
};

export const PartyResultCard = themable<Props>(
  "PartyResultCard",
  cssClasses,
)(({ classes, name, color, value, rightAligned, iconUrl, isPercentage }) => (
  <div className={mergeClasses(classes.root, rightAligned && classes.rightAlign)}>
    {iconUrl && <img className={classes.icon} src={iconUrl} alt={name} />}
    <div className={classes.column}>
      <DivBodyMedium className={classes.nameRow}>
        <ColoredSquare className={classes.square} color={color} />
        <div className={classes.name}>{name}</div>
      </DivBodyMedium>
      <DivHeading1 className={classes.percentage}>
        {isPercentage ?? true ? formatPercentage(value) : formatGroupedNumber(value)}
      </DivHeading1>
    </div>
  </div>
));
