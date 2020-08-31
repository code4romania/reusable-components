import React from "react";
import PropTypes from "prop-types";
import classes from "./PartyResultCard.module.scss";
import NameWithColor from "../NameWithColor/NameWithColor";

const PartyResultCard = ({ name, color, percentage, rightAligned }) => (
  <div
    className={classes.partyResultCard}
    style={{ alignItems: rightAligned ? "flex-end" : "flex-start" }}
  >
    <NameWithColor color={color} text={name} rightAligned={rightAligned} />
    <div className={classes.percentage}>{percentage}%</div>
  </div>
);

export default PartyResultCard;

PartyResultCard.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  rightAligned: PropTypes.bool.isRequired,
};
