import React from "react";
import { ElectionNewsCard } from "./ElectionNewsCard.tsx";
import { mockElectionNews } from "../../util/mocks";

export default {
  title: "Election news card",
  component: ElectionNewsCard,
};

export const SimpleCard = (args) => {
  return <ElectionNewsCard {...args} />;
};

SimpleCard.args = {
  news: mockElectionNews,
};

SimpleCard.argTypes = {
  news: { control: "object" },
};
