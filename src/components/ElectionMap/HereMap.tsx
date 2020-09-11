import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

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

type Props = {
  className?: string;
  width: number;
  height: number;
};

export const HereMap: React.FC<Props> = ({ className, width, height }) => {
  const H = useHereMaps();
  const apiKey = useContext(HereMapsAPIKeyContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState(null);

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
    setMap(hMap);

    new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
    H.ui.UI.createDefault(hMap, defaultLayers);

    return () => {
      hMap.dispose();
      setMap((state) => (state === hMap ? null : state));
    };
  }, [H, apiKey, mapRef]);

  useLayoutEffect(() => {
    if (map) {
      map.getViewPort().resize();
    }
  }, [width, height, map]);

  if (!H || !apiKey) {
    return null;
  }

  return <div className={className} ref={mapRef} style={{ width, height }} />;
};
