import React from "react";
import "./PartyResultInline.css"
import NameWithColor from "../NameWithColor/NameWithColor";
import PropTypes from "prop-types";
import PartyResultCard from "../PartyResultCard/PartyResultCard";

const PartyResultInline = ({name, color, percentage, votesCount}) => {
    return <div className={"party-result-inline"}>
        <NameWithColor color={color} text={name}/>
        <div className={"votes"}>{percentage}% ({votesCount})</div>
    </div>
};

export default PartyResultInline;

PartyResultCard.propTypes = {
    name: PropTypes.string.required,
    color: PropTypes.string.required,
    percentage: PropTypes.number.required,
    votesCount: PropTypes.number.required
};