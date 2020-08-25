import React from "react";
import PropTypes from "prop-types";
import "./PartyResultCard.scss";
import NameWithColor from "../NameWithColor/NameWithColor";

const PartyResultCard = ({ name, color, percentage, rightAligned }) => (
  <div
    className={"party-result-card"}
    style={{ alignItems: rightAligned ? "flex-end" : "flex-start" }}
  >
    <NameWithColor color={color} text={name} rightAligned={rightAligned} />
    <div className={"percentage"}>{percentage}%</div>
  </div>
);

export default PartyResultCard;

PartyResultCard.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  rightAligned: PropTypes.bool.isRequired,
};
