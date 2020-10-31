/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockResults } from "../../util/mocks";
import { ElectionResultsStackedBar } from "./ElectionResultsStackedBar";

const nationalResultsExample = {
  eligibleVoters: 18466219,
  totalVotes: 8419716,
  validVotes: 7937514,
  nullVotes: 482202,
  totalSeats: 0,
  candidates: [
    {
      name: "Partidul Social Democrat",
      partyColor: "#FF0000",
      partyLogo: "https://rezultatevot-media.s3.eu-central-1.amazonaws.com/v2/Logo__Partidul+Social+Democrat.jpg",
      votes: 16,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "Partidul Național Liberal",
      partyColor: "#F8DD1B",
      partyLogo: "https://rezultatevot-media.s3.eu-central-1.amazonaws.com/v2/Logo__Partidul+Na%C8%9Bional+Liberal.jpg",
      votes: 15,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "UNIUNEA DEMOCRATA MAGHIARA DIN ROMANIA",
      partyColor: "#007300",
      partyLogo:
        "https://rezultatevot-media.s3.eu-central-1.amazonaws.com/v2/Logo__Uniunea+Democrat%C4%83+a+Maghiarilor+din+Rom%C3%A2nia.jpg",
      votes: 4,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "ALIANȚA ELECTORALĂ ALIANȚA PENTRU MODERNIZAREA NEAMȚULUI 2020",
      shortName: "A. ELECTORALĂ PENTRU MODERNIZAREA NEAMȚULUI 2020",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "ALIANȚA PNL USR PLUS",
      shortName: "A. PNL USR PLUS",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "ALIANȚA PENTRU BISTRIȚA-NĂSĂUD",
      shortName: "A. NĂSĂUD",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "INDEPENDENT",
      shortName: "INDEPENDENT",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "ALIANTA ELECTORALA PSD+ALDE DOLJ",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name: "ALIANȚA PSD-PRO BUZĂU",
      shortName: "A. PRO BUZĂU",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
    {
      name:
        "ALIANȚA PARTIDUL NAȚIONAL LIBERAL - UNIUNEA SALVAȚI ROMÂNIA - PARTIDUL LIBERTATE, UNITATE ȘI SOLIDARITATE (PNL-USR-PLUS)",
      shortName: "A.  UNIUNEA SALVAȚI ROMÂNIA - PARTIDUL LIBERTATE, UNITATE ȘI SOLIDARITATE (PNL-USR-PLUS)",
      partyColor: "#808080",
      votes: 1,
      seats: 0,
      totalSeats: 0,
    },
  ],
};

export default {
  title: "Election results stacked bar",
  component: ElectionResultsStackedBar,
};

export const SimpleExample = (args: any) => {
  return <ElectionResultsStackedBar {...args} />;
};

SimpleExample.args = {
  results: mockResults,
};

SimpleExample.argTypes = {
  results: { control: "object" },
};

export const ExampleWithDiscreteValues = (args: any) => {
  return <ElectionResultsStackedBar {...args} />;
};

ExampleWithDiscreteValues.args = {
  results: nationalResultsExample,
  displayPercentages: false,
};

ExampleWithDiscreteValues.argTypes = {
  results: { control: "object" },
};
