import React from 'react';
import PartyResultCard from "./PartyResultCard";

import {number, text, boolean, withKnobs} from "@storybook/addon-knobs";

export default {
    title: 'Party Result Card',
    component: PartyResultCard,
    decorators: [withKnobs]
};

export const SimpleCard = () => {
    const color = "#0000ff";
    const rightAligned = boolean("rightAligned", false);
    const name = text("Party Name", "PNL");
    const percentage = number("Percentage", 32);

    return <PartyResultCard color={color} name={name} percentage={percentage} rightAligned={rightAligned}/>;
};

SimpleCard.story = {
    name: 'simple card',
};
