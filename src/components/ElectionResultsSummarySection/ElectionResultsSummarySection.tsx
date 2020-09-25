import React, { ReactNode } from "react";
import {
  ElectionBallotMeta,
  ElectionResults,
  ElectionScopeIncomplete,
  ElectionScopeIncompleteResolved,
  electionScopeIsComplete,
  electionTypeInvolvesDiaspora,
} from "../../types/Election";
import { themable } from "../../hooks/theme";
import { useDimensions } from "../../hooks/useDimensions";
import { ElectionResultsStackedBar } from "../ElectionResultsStackedBar/ElectionResultsStackedBar";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { electionCandidateColor, formatPercentage, fractionOf, getScopeName } from "../../util/format";
import { DivBodyHuge, Heading2, Label } from "../Typography/Typography";
import { ElectionScopeIncompleteWarning } from "../Warning/ElectionScopeIncompleteWarning";
import { ElectionResultsSummaryTable } from "../ElectionResultsSummaryTable/ElectionResultsSummaryTable";
import { ElectionMapAPI } from "../../util/electionApi";
import cssClasses from "./ElectionResultsSummarySection.module.scss";

type Props = {
  api?: ElectionMapAPI;
  meta?: ElectionBallotMeta | null;
  scope: ElectionScopeIncompleteResolved;
  results?: ElectionResults | null;
  separator?: ReactNode;
  onScopeChange?: (scope: ElectionScopeIncomplete) => unknown;
  loader?: ReactNode;
};

const defaultConstants = {
  breakpoint1: 840,
  breakpoint2: 330,
};

export const ElectionResultsSummarySection = themable<Props>(
  "ElectionResultsSummarySection",
  cssClasses,
  defaultConstants,
)(({ classes, results, meta, api, scope, onScopeChange, loader, constants, separator }) => {
  const involvesDiaspora = !!meta && electionTypeInvolvesDiaspora(meta.type);

  const [measureRef, { width }] = useDimensions();

  const completeness = electionScopeIsComplete(scope);

  const topCandidate = results?.candidates && results.candidates[0];

  const map = width != null && (
    <ElectionMap
      scope={scope}
      onScopeChange={onScopeChange}
      involvesDiaspora={involvesDiaspora}
      className={classes.map}
      selectedColor={topCandidate && electionCandidateColor(topCandidate)}
      api={api}
      ballotId={meta?.ballotId}
    >
      {topCandidate && (
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayPercentage}>
            {formatPercentage(fractionOf(topCandidate.votes, results?.validVotes || 0))}
          </div>
          <div className={classes.mapOverlayLabel}>{topCandidate.shortName || topCandidate.name}</div>
        </div>
      )}
    </ElectionMap>
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
          <Heading2>Rezultate vot</Heading2>
          <div>
            <Label>{getScopeName(scope)}</Label>
          </div>
        </>
      )}
      {!completeness.complete && (
        <ElectionScopeIncompleteWarning className={classes.warning} completeness={completeness} page="results" />
      )}
      {results == null &&
        completeness.complete &&
        (loader ? (
          loader
        ) : (
          <DivBodyHuge className={classes.warning}>
            Nu există date despre prezența la vot pentru acest nivel de detaliu.
          </DivBodyHuge>
        ))}
      {results && <ElectionResultsStackedBar className={classes.stackedBar} results={results} />}
      <div style={{ width: "100%" }} ref={measureRef} />
      {results && !mobileMap && separator}
      {!mobileMap && (
        <div className={classes.mapSummaryContainer}>
          {!fullWidthMap && meta && results && (
            <ElectionResultsSummaryTable className={classes.mapSummaryTable} meta={meta} results={results} />
          )}
          {map}
        </div>
      )}
    </>
  );
});
