import React, { ReactNode } from "react";
import {
  ElectionBallotMeta,
  ElectionResults,
  ElectionScopeIncomplete,
  ElectionScopeIncompleteResolved,
  electionScopeIsComplete,
} from "../../types/Election";
import { themable, useTheme } from "../../hooks/theme";
import { useDimensions } from "../../hooks/useDimensions";
import { ElectionResultsStackedBar } from "../ElectionResultsStackedBar/ElectionResultsStackedBar";
import { ElectionMap } from "../ElectionMap/ElectionMap";
import { electionCandidateColor, formatPercentage, fractionOf, getScopeName } from "../../util/format";
import { DivBodyHuge, Heading2, Label } from "../Typography/Typography";
import { ElectionScopeIncompleteWarning } from "../Warning/ElectionScopeIncompleteWarning";
import {
  ElectionResultsSummaryTable,
  ElectionResultsSummaryTableHeaders,
} from "../ElectionResultsSummaryTable/ElectionResultsSummaryTable";
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
  tableHeaders?: ElectionResultsSummaryTableHeaders;
};

const defaultConstants = {
  breakpoint1: 840,
  breakpoint2: 330,
};

export const ElectionResultsSummarySection = themable<Props>(
  "ElectionResultsSummarySection",
  cssClasses,
  defaultConstants,
)(({ classes, results, meta, api, scope, onScopeChange, loader, constants, separator, tableHeaders }) => {
  const [measureRef, { width }] = useDimensions();

  const completeness = electionScopeIsComplete(scope);

  const topCandidate = results?.candidates && results.candidates[0];

  // const livePercentage = formatPercentage(fractionOf(results?.countedVotes ?? 0, results?.totalVotes ?? 0));
  const liveText =
    meta?.stage === "final" ? "Rezultatele finale in urma numararii tuturor voturilor sunt" : "Numaratoare partiale";

  const percentage = formatPercentage(
    fractionOf(
      topCandidate?.votes ?? 0,
      (meta?.type === "referendum" ? results?.eligibleVoters : results?.validVotes) ?? 0,
    ),
  );
  const theme = useTheme();

  const map = width != null && (
    <ElectionMap
      scope={scope}
      electionType={meta?.type}
      onScopeChange={onScopeChange}
      className={classes.map}
      selectedColor={topCandidate && electionCandidateColor(topCandidate)}
      defaultColor={theme.colors.secondary}
      api={api}
      ballotId={meta?.ballotId}
    >
      {topCandidate && (
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayPercentage}>{percentage}</div>
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
          {meta?.live && (
            <div>
              <Label>{liveText}</Label>
            </div>
          )}
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
            Nu există date disponibile pentru această unitate administrativ teritorială. Fie nu există date disponibile,
            fie câștigătorii pentru această unitate au fost aleși în primul tur de scrutin.
          </DivBodyHuge>
        ))}
      {results && (
        <ElectionResultsStackedBar className={classes.stackedBar} results={results} meta={meta} scope={scope} />
      )}
      <div style={{ width: "100%" }} ref={measureRef} />
      {results && !mobileMap && separator}
      {!mobileMap && (
        <div className={classes.mapSummaryContainer}>
          {!fullWidthMap && meta && results && (
            <ElectionResultsSummaryTable
              className={classes.mapSummaryTable}
              meta={meta}
              scope={scope}
              results={results}
              headers={tableHeaders}
            />
          )}
          {map}
        </div>
      )}
    </>
  );
});
