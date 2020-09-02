import React from "react";
import { DIASPORA, ElectionMeta, ElectionScope, ElectionTurnout } from "../../types/Election";
import { themable } from "../../util/theme";
import { BodyHuge, Heading2, Label } from "../Typography/Typography";
import cssClasses from "./ElectionTurnoutSection.module.scss";

type Props = {
  meta: ElectionMeta;
  scope: ElectionScope;
  turnout?: ElectionTurnout;
};

function getScopeName(scope: ElectionScope) {
  switch (scope.type) {
    case "national":
      return "Nivel Național";
    case "county":
      return scope.county === DIASPORA ? "Diaspora" : `Județul ${scope.county}`;
    case "uat":
      return scope.county === DIASPORA
        ? `Diaspora din ${scope.uat}`
        : `Unitatea administrativ-teritorială ${scope.uat}`;
    case "city":
      return `Localitatea ${scope.city}`;
  }
}

export const ElectionTurnoutSection = themable<Props>(
  "ElectionTurnoutSection",
  cssClasses,
)(({ meta, scope, turnout, classes }) => {
  return (
    <>
      <Heading2>Prezența la vot</Heading2>
      <div>
        <Label>{getScopeName(scope)}</Label>
        {turnout == null && (
          <div className={classes.unavailable}>
            <BodyHuge>Nu există date despre prezența la vot pentru acest nivel de detaliu.</BodyHuge>
          </div>
        )}
      </div>
    </>
  );
});
