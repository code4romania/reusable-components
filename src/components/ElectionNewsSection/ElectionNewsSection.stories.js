import React from "react";
import { ElectionNewsSection } from "./ElectionNewsSection.tsx";
import { mockElectionNews } from "../../util/mocks";

export default {
  title: "Election news section",
  component: ElectionNewsSection,
};

const feed = new Array(10).fill(mockElectionNews).map((news, index) => ({ ...news, id: index }));

export const SimpleExample = () => {
  return <ElectionNewsSection feed={feed} />;
};
