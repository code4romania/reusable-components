import React from "react";
import "./PartyResultInline.scss";
import NameWithColor from "../NameWithColor/NameWithColor";
import PropTypes from "prop-types";

const PartyResultInline = ({ name, color, percentage, votesCount }) => (
  <div className={"party-result-inline"}>
    <NameWithColor color={color} text={name} />
    <div className={"votes"}>
      {percentage}% ({votesCount})
    </div>
  </div>
);

export default PartyResultInline;

PartyResultInline.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  votesCount: PropTypes.number.isRequired,
};
