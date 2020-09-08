import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

const defaultAspectRatio = 21 / 15;
const defaultDiasporaAspectRatio = 38 / 25;
const defaultMaxHeight = 460;

const loadJS = (src: string) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
    script.src = src;
    window?.document?.getElementsByTagName("head")[0].appendChild(script);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HereMapsAPI = any;

const loadHereMaps = async () => {
  await loadJS("https://js.api.here.com/v3/3.1/mapsjs-core.js");
  await Promise.all([
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-service.js"),
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"),
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-ui.js"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).H as HereMapsAPI;
};

let hereMapsPromise: Promise<HereMapsAPI> | void = null;
const getHereMaps = (): Promise<HereMapsAPI> => {
  if (hereMapsPromise) {
    return hereMapsPromise;
  }
  hereMapsPromise = loadHereMaps();
  return hereMapsPromise;
};

getHereMaps(); // Load on startup

export const useHereMaps = (): HereMapsAPI | void => {
  const [savedH, setH] = useState<HereMapsAPI>(null);
  useEffect(() => {
    let set = setH;
    getHereMaps().then((H) => {
      if (set) {
        set(H);
      }
    });
    return () => {
      set = null;
    };
  }, []);
  return savedH;
};

export const HereMapsAPIKeyContext = createContext<string>("");
export const HereMapsAPIKeyProvider = HereMapsAPIKeyContext.Provider;

const HereMap = ({ classes, width, height }) => {
  const H = useHereMaps();
  const apiKey = useContext(HereMapsAPIKeyContext);
  const mapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!H || !apiKey || !mapRef.current) {
      return;
    }

    const platform = new H.service.Platform({
      apikey: apiKey,
    });
    const defaultLayers = platform.createDefaultLayers();
    const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 50, lng: 5 },
      zoom: 4,
      pixelRatio: window.devicePixelRatio || 1,
    });

    new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
    H.ui.UI.createDefault(hMap, defaultLayers);

    return () => {
      hMap.dispose();
    };
  }, [H, apiKey, mapRef]);

  if (!H || !apiKey) {
    return null;
  }

  return <div className={classes.hereMap} ref={mapRef} style={{ width, height }} />;
};

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
          width > 0 && height > 0 && <HereMap classes={classes} width={width} height={height} />
        )}
      </div>
    </div>
  );
});
