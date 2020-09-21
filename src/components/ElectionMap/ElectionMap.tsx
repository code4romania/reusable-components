import React, { PropsWithChildren, useMemo } from "react";
import { ElectionScopeIncomplete } from "../../types/Election";
import { themable } from "../../util/theme";
import cssClasses from "./ElectionMap.module.scss";
import RomaniaMap from "../../assets/romania-map.svg";
import WorldMap from "../../assets/world-map.svg";
import useDimensions from "react-use-dimensions";
import { HereMap, romaniaMapBounds, worldMapBounds } from "../HereMap/HereMap";
import { electionMapOverlayUrl } from "../../constants/servers";

type Props = PropsWithChildren<{
  scope: ElectionScopeIncomplete;
  onScopeChange?: (scope: ElectionScopeIncomplete) => unknown;
  involvesDiaspora?: boolean; // electionTypeInvolvesDiaspora(election.meta.type)
  aspectRatio?: number;
  maxHeight?: number;
}>;

const defaultAspectRatio = 21 / 15;
const defaultDiasporaAspectRatio = 38 / 25;
const defaultMaxHeight = 460;

export const ElectionMap = themable<Props>(
  "ElectionMap",
  cssClasses,
)(({ classes, scope, onScopeChange, involvesDiaspora, aspectRatio, maxHeight = defaultMaxHeight, children }) => {
  const [ref, { width = 0 }] = useDimensions();

  const showsSimpleMap = scope.type === "national";
  const ar = aspectRatio ?? (showsSimpleMap && involvesDiaspora ? defaultDiasporaAspectRatio : defaultAspectRatio);
  let height = Math.min(maxHeight, width / ar);
  if (!Number.isFinite(height)) {
    height = 0;
  }

  const [overlayUrl, selectedFeature, scopeModifier] = useMemo<
    [string, number | null, (featureId: number) => ElectionScopeIncomplete]
  >(() => {
    if (scope.type === "locality" && scope.countyId != null) {
      return [
        `${electionMapOverlayUrl}/localities_${scope.countyId}.geojson`,
        scope.localityId ?? null,
        (localityId) => ({ ...scope, localityId }),
      ];
    }
    if ((scope.type === "locality" && scope.countyId == null) || scope.type === "county") {
      return [
        `${electionMapOverlayUrl}/counties.geojson`,
        scope.countyId ?? null,
        (countyId) => ({ ...scope, countyId }),
      ];
    }
    if (scope.type === "diaspora" || scope.type === "diaspora_country") {
      return [
        `${electionMapOverlayUrl}/diaspora_countries.geojson`,
        scope.type === "diaspora_country" && scope.countryId != null ? scope.countryId : null,
        (countryId) => ({ type: "diaspora_country", countryId }),
      ];
    }
    return [`${electionMapOverlayUrl}/dobrogea.geojson`, null, (countyId) => ({ type: "county", countyId })];
  }, [scope]);

  const onFeatureSelect = useMemo(
    () =>
      onScopeChange &&
      ((featureId: number) => {
        onScopeChange(scopeModifier(featureId));
      }),
    [onScopeChange, scopeModifier],
  );

  return (
    <div className={classes.root} ref={ref} style={{ height }}>
      <div className={classes.container} style={{ width, height }}>
        {showsSimpleMap ? (
          <div className={classes.staticMap} style={{ maxWidth: height * ar, fontSize: height * ar * 0.05 }}>
            <div className={classes.staticMapRomaniaContainer}>
              <RomaniaMap className={classes.staticMapRomania} />
              {children}
            </div>
            {involvesDiaspora && (
              <div className={classes.staticMapWorldContainer} style={{ fontSize: Math.min(16, height * ar * 0.05) }}>
                <div className={classes.staticMapWorldLabel}>Diaspora</div>
                <WorldMap className={classes.staticMapWorld} />
              </div>
            )}
          </div>
        ) : (
          width > 0 &&
          height > 0 && (
            <HereMap
              className={classes.hereMap}
              width={width}
              height={height}
              initialBounds={
                scope.type === "diaspora" || scope.type === "diaspora_country" ? worldMapBounds : romaniaMapBounds
              }
              overlayUrl={overlayUrl}
              selectedFeature={selectedFeature}
              onFeatureSelect={onFeatureSelect}
            />
          )
        )}
      </div>
    </div>
  );
});
