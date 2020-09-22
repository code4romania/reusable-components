import React from "react";
import { ElectionNewsCard } from "./ElectionNewsCard.tsx";
import { mockElectionNews } from "../../util/mocks";

export default {
  title: "Election news card",
  component: ElectionNewsCard,
};

export const SimpleCard = () => {
  return <ElectionNewsCard news={mockElectionNews} />;
};
