import React, { ReactNode } from "react";
import {
  ElectionBallotMeta,
  ElectionResults,
  ElectionScopeIncompleteResolved,
  electionScopeIsComplete,
  electionTypeInvolvesDiaspora,
} from "../../types/Election";
import { themable } from "../../util/theme";
import useDimensions from "react-use-dimensions";
import cssClasses from "./ElectionResultsSummarySection.module.scss";
import { ElectionResultsStackedBar } from "../ElectionResultsStackedBar/ElectionResultsStackedBar";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { getScopeName } from "../../util/format";
import { DivBodyHuge, Heading2, Label } from "../Typography/Typography";
import { ElectionScopeIncompleteWarning } from "../Warning/ElectionScopeIncompleteWarning";
import { ElectionResultsSummaryTable } from "../ElectionResultsSummaryTable/ElectionResultsSummaryTable";

type Props = {
  meta: ElectionBallotMeta;
  scope: ElectionScopeIncompleteResolved;
  results?: ElectionResults | null;
  separator?: ReactNode;
};

const defaultConstants = {
  breakpoint1: 840,
  breakpoint2: 330,
};

export const ElectionResultsSummarySection = themable<Props>(
  "ElectionResultsSummarySection",
  cssClasses,
  defaultConstants,
)(({ classes, results, meta, scope, constants, separator }) => {
  const involvesDiaspora = electionTypeInvolvesDiaspora(meta.type);

  const [measureRef, { width }] = useDimensions();

  const completeness = electionScopeIsComplete(scope);

  const map = width != null && (
    <ElectionMap scope={scope} involvesDiaspora={involvesDiaspora} className={classes.map} />
  );

  const { breakpoint1, breakpoint2 } = constants;
  const mobileMap = width != null && width <= breakpoint2;
  const fullWidthMap = !mobileMap && width != null && width <= breakpoint1;

  const showHeading = results != null && completeness.complete;

  return (
    <>
      {mobileMap && map}
      {mobileMap && showHeading && separator}
      {showHeading && (
        <>
          <Heading2>Prezența la vot</Heading2>
          <div>
            <Label>{getScopeName(scope)}</Label>
          </div>
        </>
      )}
      {!completeness.complete && (
        <ElectionScopeIncompleteWarning className={classes.warning} completeness={completeness} page="results" />
      )}
      {results == null && completeness.complete && (
        <DivBodyHuge className={classes.warning}>
          Nu există date despre prezența la vot pentru acest nivel de detaliu.
        </DivBodyHuge>
      )}
      {results && <ElectionResultsStackedBar className={classes.stackedBar} results={results} />}
      <div style={{ width: "100%" }} ref={measureRef} />
      {results && !mobileMap && separator}
      {!mobileMap && (
        <div className={classes.mapSummaryContainer}>
          {!fullWidthMap && results && (
            <ElectionResultsSummaryTable className={classes.mapSummaryTable} meta={meta} results={results} />
          )}
          {map}
        </div>
      )}
    </>
  );
});
