import React from "react";
import { mergeClasses, themable } from "../../hooks/theme";
import { formatGroupedNumber, formatPercentage } from "../../util/format";
import { DivBodyMedium, DivHeading1 } from "../Typography/Typography";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import PersonIcon from "../../assets/person.svg";
import cssClasses from "./PartyResultCard.module.scss";

type Props = {
  name: string;
  color: string;
  value: number;
  variant?: "percentage" | "seats" | "plain";
  rightAligned?: boolean;
  iconUrl?: string;
};

export const PartyResultCard = themable<Props>(
  "PartyResultCard",
  cssClasses,
)(({ classes, name, color, value, rightAligned, iconUrl, variant = "percentage" }) => (
  <div className={mergeClasses(classes.root, rightAligned && classes.rightAlign)}>
    {iconUrl && <img className={classes.icon} src={iconUrl} alt={name} />}
    <div className={classes.column}>
      <DivBodyMedium className={classes.nameRow}>
        <ColoredSquare className={classes.square} color={color} />
        <div className={classes.name}>{name}</div>
      </DivBodyMedium>
      <DivHeading1 className={classes.percentage}>
        {variant === "percentage" ? formatPercentage(value) : formatGroupedNumber(value)}
        {variant === "seats" && <PersonIcon className={classes.seatsIcon} />}
      </DivHeading1>
    </div>
  </div>
));
