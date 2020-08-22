import React from "react";
import "./NameWithColor.css"

const NameWithColor = ({text, color, rightAligned}) =>
    <div className={"name-with-color"}><div className={"color-marker"} style={{backgroundColor: color, float: rightAligned ? "right" : "left"}}/>{text}</div>;

export default NameWithColor;
