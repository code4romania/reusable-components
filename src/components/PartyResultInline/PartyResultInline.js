import React from "react";
import classes from "./PartyResultInline.module.scss";
import NameWithColor from "../NameWithColor/NameWithColor";
import PropTypes from "prop-types";

const PartyResultInline = ({ name, color, percentage, votesCount }) => (
  <div className={classes.partyResultInline}>
    <NameWithColor color={color} text={name} />
    <div className={classes.votes}>
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
