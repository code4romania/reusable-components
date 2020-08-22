import React from 'react';
import PartyResultCard from "./PartyResultCard";
import {Result} from "../../domain/Result";
import {PoliticalParty} from "../../domain/Party";

import {number, text, boolean, withKnobs} from "@storybook/addon-knobs";

export default {
    title: 'Party Result Card',
    component: PartyResultCard,
    decorators: [withKnobs]
};

export const SimpleCard = () => {
    const party = new PoliticalParty(text("Party Name", "PNL"), "#0000ff");
    const result = new Result(party, 1000, number("Percentage", 32));
    const rightAligned = boolean("rightAligned", false);

    return <PartyResultCard result={result} rightAligned={rightAligned}/>;
};

SimpleCard.story = {
    name: 'simple card',
};
