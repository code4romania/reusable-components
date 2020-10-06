import React, { createContext, PropsWithChildren, useContext, useCallback, useMemo } from "react";
import { ElectionMapScope, ElectionMapWinner, ElectionScopeIncomplete } from "../../types/Election";
import { mergeClasses, themable } from "../../hooks/theme";
import RomaniaMap from "../../assets/romania-map.svg";
import { useDimensions } from "../../hooks/useDimensions";
import { bucharestCenteredWorldZoom, HereMap, romaniaMapBounds } from "../HereMap/HereMap";
import { electionMapOverlayUrl } from "../../constants/servers";
import cssClasses from "./ElectionMap.module.scss";
import { ElectionMapAPI } from "../../util/electionApi";
import { useApiResponse } from "../../hooks/useApiResponse";
import { electionCandidateColor, formatPercentage, fractionOf } from "../../util/format";
import Color from "color";

type Props = PropsWithChildren<{
  scope: ElectionScopeIncomplete;
  onScopeChange?: (scope: ElectionScopeIncomplete) => unknown;
  aspectRatio?: number;
  maxHeight?: number;
  selectedColor?: string;
  defaultColor?: string;

  api?: ElectionMapAPI;
  ballotId?: number | null;
}>;

const defaultAspectRatio = 21 / 15;
const defaultMaxHeight = 460;

export const ElectionMapOverlayURLContext = createContext<string>(electionMapOverlayUrl);

export const ElectionMap = themable<Props>(
  "ElectionMap",
  cssClasses,
)(
  ({
    classes,
    scope,
    onScopeChange,
    aspectRatio,
    maxHeight = defaultMaxHeight,
    children,
    selectedColor,
    defaultColor,
    api,
    ballotId,
  }) => {
    const [ref, { width = 0 }] = useDimensions();

    const showsSimpleMap = scope.type === "national";
    const ar = aspectRatio ?? defaultAspectRatio;
    let height = Math.min(maxHeight, width / ar);
    if (!Number.isFinite(height)) {
      height = 0;
    }

    const overlayBaseUrl = useContext(ElectionMapOverlayURLContext);
    const [mapScope, selectedFeature, scopeModifier] = useMemo<
      [ElectionMapScope, number | null, (featureId: number) => ElectionScopeIncomplete]
    >(() => {
      if (scope.type === "locality" && scope.countyId != null) {
        return [
          { type: "county", countyId: scope.countyId },
          scope.localityId ?? null,
          (localityId) => ({ ...scope, localityId }),
        ];
      }
      if ((scope.type === "locality" && scope.countyId == null) || scope.type === "county") {
        return [{ type: "national" }, scope.countyId ?? null, (countyId) => ({ ...scope, countyId })];
      }
      if (scope.type === "diaspora" || scope.type === "diaspora_country") {
        return [
          { type: "diaspora" },
          scope.type === "diaspora_country" && scope.countryId != null ? scope.countryId : null,
          (countryId) => ({ type: "diaspora_country", countryId }),
        ];
      }
      return [{ type: "national" }, null, (countyId) => ({ type: "county", countyId })];
    }, [scope, overlayBaseUrl]);

    const [overlayUrl, maskUrl] = useMemo(() => {
      switch (mapScope.type) {
        case "county":
          return [
            `${overlayBaseUrl}/localities_${mapScope.countyId}.geojson`,
            `${overlayBaseUrl}/mask_county_${mapScope.countyId}.geojson`,
          ];
        case "national":
          return [`${overlayBaseUrl}/counties.geojson`, `${overlayBaseUrl}/mask_romania.geojson`];
        case "diaspora":
          return [`${overlayBaseUrl}/countries.geojson`, undefined];
      }
    }, [mapScope.type, mapScope.type === "county" && mapScope.countyId]);

    const winners = useApiResponse(() => {
      return {
        invocation: (api && ballotId != null && api.getWinnerMap(ballotId, mapScope)) || undefined,
        discardPreviousData: true,
      };
    }, [api, ballotId, mapScope.type, mapScope.type === "county" && mapScope.countyId]);

    const [winnerColors, winnerRegistry] = useMemo(() => {
      const colors = new Map<number, string>();
      const registry = new Map<number, ElectionMapWinner>();

      if (winners.data) {
        winners.data.forEach((winner) => {
          const { id } = winner;
          colors.set(id, electionCandidateColor(winner.winner));
          registry.set(id, winner);
        });
      }

      return [colors, registry];
    }, [winners.data]);

    const onFeatureSelect = useMemo(
      () =>
        onScopeChange &&
        ((featureId: number) => {
          onScopeChange(scopeModifier(featureId));
        }),
      [onScopeChange, scopeModifier],
    );

    const renderFeatureTooltip = useCallback(
      (id, { name }) => {
        if (!name) return null;
        const root = document.createElement("div");
        root.className = classes.tooltip;

        root.appendChild(new Text(name));

        const winner = winnerRegistry.get(id);
        if (winner) {
          root.appendChild(document.createElement("br"));
          const winnerEl = document.createElement("span");
          winnerEl.className = classes.tooltipWinner;

          const winnerName = document.createElement("span");
          winnerName.className = classes.tooltipName;
          winnerName.textContent = winner.winner.shortName || winner.winner.name;

          winnerEl.appendChild(winnerName);
          winnerEl.appendChild(new Text(` - ${formatPercentage(fractionOf(winner.winner.votes, winner.validVotes))}`));

          root.appendChild(winnerEl);
        }
        return root;
      },
      [winnerRegistry],
    );

    const getFeatureColor = useCallback((id) => winnerColors.get(id) || null, [winnerColors]);
    const simpleMapColor = (showsSimpleMap && (selectedColor || defaultColor)) || undefined;

    return (
      <div className={classes.root} ref={ref} style={{ height }}>
        <div className={classes.container} style={{ width, height }}>
          {showsSimpleMap ? (
            <div className={classes.staticMap} style={{ maxWidth: height * ar, fontSize: height * ar * 0.05 }}>
              <div
                className={mergeClasses(
                  classes.staticMapRomaniaContainer,
                  simpleMapColor && new Color(simpleMapColor).isDark() ? classes.staticDark : classes.staticLight,
                )}
              >
                <RomaniaMap className={classes.staticMapRomania} style={{ color: simpleMapColor }} />
                {children}
              </div>
            </div>
          ) : (
            width > 0 &&
            height > 0 && (
              <HereMap
                className={classes.hereMap}
                width={width}
                height={height}
                initialTransform={
                  scope.type === "diaspora" || scope.type === "diaspora_country"
                    ? bucharestCenteredWorldZoom
                    : romaniaMapBounds
                }
                overlayLoadTransform={
                  scope.type === "diaspora" || scope.type === "diaspora_country" ? bucharestCenteredWorldZoom : "bounds"
                }
                allowZoomAndPan={scope.type === "diaspora" || scope.type === "diaspora_country"}
                overlayUrl={overlayUrl}
                maskOverlayUrl={maskUrl}
                selectedFeature={selectedFeature}
                centerOnSelectedFeatureBounds={scope.type === "diaspora_country"}
                onFeatureSelect={onFeatureSelect}
                getFeatureColor={getFeatureColor}
                renderFeatureTooltip={renderFeatureTooltip}
                constants={
                  selectedColor || defaultColor
                    ? {
                        selectedFeatureColor: selectedColor,
                        featureDefaultColor: defaultColor,
                      }
                    : undefined
                }
              />
            )
          )}
        </div>
      </div>
    );
  },
);
