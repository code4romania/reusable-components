/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { mockObservation } from "../../util/mocks";
import { ElectionObservationSection } from "./ElectionObservationSection";

export default {
  title: "Election / Observation section",
  component: ElectionObservationSection,
};

export const SimpleExample = () => {
  return <ElectionObservationSection observation={mockObservation} />;
};
