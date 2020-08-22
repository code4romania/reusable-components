import React from "react";
import PercentageAsBar from "./PercentageAsBar.js";
import {number, withKnobs} from "@storybook/addon-knobs";

export default {
    title: "Percentage as a bar",
    component: PercentageAsBar,
    decorators: [withKnobs]
}

export const SimpleExample = () => {
    return <PercentageAsBar value={number("Percentage", 72.5)} totalColor={"#ff0000"}/>
};