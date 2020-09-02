import React from "react";
import { ElectionMeta, ElectionTurnout } from "../../types/Election";
import { themable } from "../../util/theme";
import { Heading2 } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";

type Props = {
  meta: ElectionMeta;
  turnout: ElectionTurnout;
};

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
)(() => {
  return (
    <>
      <Heading2>Prezența la vot</Heading2>
    </>
  );
});
