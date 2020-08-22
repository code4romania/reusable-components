import React from "react";
import "./NameWithColor.scss";
import PropTypes from "prop-types";

const NameWithColor = ({ text, color, rightAligned }) => (
  <div className={"name-with-color"}>
    <div
      className={"color-marker"}
      style={{ backgroundColor: color, float: rightAligned ? "right" : "left" }}
    />
    {text}
  </div>
);

export default NameWithColor;

NameWithColor.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rightAligned: PropTypes.bool.isRequired,
};
