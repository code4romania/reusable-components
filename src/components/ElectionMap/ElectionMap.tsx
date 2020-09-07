import React, { PropsWithChildren } from "react";
import { ElectionScopeIncomplete } from "../../types/Election";
import { themable } from "../../util/theme";
import cssClasses from "./ElectionMap.module.scss";
import RomaniaMap from "../../assets/romania-map.svg";
import WorldMap from "../../assets/world-map.svg";
import useDimensions from "react-use-dimensions";

type Props = PropsWithChildren<{
  scope: ElectionScopeIncomplete;
  involvesDiaspora?: boolean; // electionTypeInvolvesDiaspora(election.meta.type)
  aspectRatio?: number;
  maxHeight?: number;
}>;

const HereMap = () => {
  return (
    <div
      style={{
        backgroundColor: "#FFCC00",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontWeight: 600,
      }}
    >
      <div>Here maps not implemented</div>
    </div>
  );
};

const defaultAspectRatio = 21 / 15;
const defaultDiasporaAspectRatio = 38 / 25;
const defaultMaxHeight = 460;

export const ElectionMap = themable<Props>(
  "ElectionMap",
  cssClasses,
)(({ classes, scope, involvesDiaspora, aspectRatio, maxHeight = defaultMaxHeight, children }) => {
  const [ref, { width = 0 }] = useDimensions();

  const showsSimpleMap = scope.type === "national";
  const ar = aspectRatio ?? (showsSimpleMap && involvesDiaspora ? defaultDiasporaAspectRatio : defaultAspectRatio);
  let height = Math.min(maxHeight, width / ar);
  if (!Number.isFinite(height)) {
    height = 0;
  }

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
          <HereMap />
        )}
      </div>
    </div>
  );
});
