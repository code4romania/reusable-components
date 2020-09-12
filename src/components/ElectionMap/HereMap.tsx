import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { themable } from "../../util/theme";
import cssClasses from "./HereMap.module.scss";

type OnFeatureSelect = (featureId: number) => unknown;

type Props = {
  className?: string;
  width: number;
  height: number;
  overlayUrl?: string;
  selectedFeature?: number | void;
  onFeatureSelect?: OnFeatureSelect;
};

const loadJS = (src: string) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
    script.src = src;
    window?.document?.getElementsByTagName("head")[0].appendChild(script);
  });

type HereMapsAPI = typeof H;

const loadHereMaps = async () => {
  await loadJS("https://js.api.here.com/v3/3.1/mapsjs-core.js");
  await Promise.all([
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-service.js"),
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"),
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-ui.js"),
    loadJS("https://js.api.here.com/v3/3.1/mapsjs-data.js"),
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

const defaultValues = {
  featureStroke: "#FFCC00",
  featureFill: "rgba(255, 204, 0, 0.3)",
  featureHoverFill: "rgba(255, 204, 0, 0.6)",
};

type InstanceVars = {
  selectedFeature: number | void;
  hoveredFeature: { id: number; name: string };
  onFeatureSelect: OnFeatureSelect;
  group: H.map.Group;
  features: Map<number, H.map.Polygon>;
  tooltipEl: HTMLDivElement;
  tooltipClassName: string;
  tooltipTop: number;
  tooltipLeft: number;
};

export const HereMap = themable<Props>(
  "HereMap",
  cssClasses,
  defaultValues,
)(({ classes, themeValues, width, height, overlayUrl, selectedFeature, onFeatureSelect }) => {
  const H = useHereMaps();
  const apiKey = useContext(HereMapsAPIKeyContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<H.Map>(null);

  const featureStyles = useMemo(
    () =>
      H && {
        default: new H.map.SpatialStyle({
          fillColor: themeValues.featureFill,
          strokeColor: themeValues.featureStroke,
          lineWidth: 2,
        }),
        selected: new H.map.SpatialStyle({
          fillColor: themeValues.featureStroke,
          strokeColor: themeValues.featureStroke,
          lineWidth: 2,
        }),
        hover: new H.map.SpatialStyle({
          fillColor: themeValues.featureHoverFill,
          strokeColor: themeValues.featureStroke,
          lineWidth: 2,
        }),
      },
    [H, themeValues.featureFill, themeValues.featureStroke, themeValues.featureHoverFill],
  );

  // Instance vars
  const inst = useRef<InstanceVars>({
    selectedFeature,
    hoveredFeature: null,
    onFeatureSelect,
    group: null,
    features: null,
    tooltipEl: null,
    tooltipClassName: classes.tooltip,
    tooltipTop: 0,
    tooltipLeft: 0,
  });

  useLayoutEffect(() => {
    if (!H || !apiKey || !mapRef.current) {
      return;
    }

    const self = inst.current;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hMap.addEventListener("pointermove", (evt: any) => {
      const { offsetX = 0, offsetY = 0 } = evt.originalEvent;
      self.tooltipLeft = offsetX;
      self.tooltipTop = offsetY;
      if (self.tooltipEl) {
        self.tooltipEl.style.left = `${offsetX}px`;
        self.tooltipEl.style.top = `${offsetY}px`;
      }
    });

    return () => {
      hMap.dispose();
      (hMap as any).disposed = true; // eslint-disable-line @typescript-eslint/no-explicit-any
      setMap((state) => (state === hMap ? null : state));
    };
  }, [H, apiKey, mapRef]);

  useLayoutEffect(() => {
    if (map) {
      map.getViewPort().resize();
    }
  }, [width, height, map]);

  // Whenever selectedFeature changes
  useLayoutEffect(() => {
    const self = inst.current;
    const { features, selectedFeature: lastSelectedFeature, hoveredFeature } = self;
    self.selectedFeature = selectedFeature;

    // Update feature styles
    if (features && typeof lastSelectedFeature === "number") {
      const feature = features.get(lastSelectedFeature);
      if (feature) {
        feature.setStyle(lastSelectedFeature === hoveredFeature?.id ? featureStyles.hover : featureStyles.default);
      }
    }
    if (features && typeof selectedFeature === "number") {
      const feature = features.get(selectedFeature);
      if (feature) {
        feature.setStyle(featureStyles.selected);
      }
    }

    // Adjust map view
    // TODO
  }, [selectedFeature]);

  useLayoutEffect(() => {
    inst.current.onFeatureSelect = onFeatureSelect;
  }, [onFeatureSelect]);

  useLayoutEffect(() => {
    const self = inst.current;
    self.tooltipClassName = classes.tooltip;
    if (self.tooltipEl) {
      self.tooltipEl.className = classes.tooltip;
    }
  }, [classes.tooltip]);

  useLayoutEffect(() => {
    if (!H || !map || !overlayUrl) return;
    const self = inst.current;

    const setHoveredFeature = (id?: number, name?: string) => {
      const hadTooltip = !!self.hoveredFeature;
      const hasTooltip = id != null;
      self.hoveredFeature = hasTooltip ? { id, name } : null;

      if (!hadTooltip && hasTooltip) {
        const tooltipEl = document.createElement("div");
        tooltipEl.className = self.tooltipClassName;
        tooltipEl.style.left = `${self.tooltipLeft}px`;
        tooltipEl.style.top = `${self.tooltipTop}px`;
        mapRef.current?.appendChild(tooltipEl);
        self.tooltipEl = tooltipEl;
      } else if (hadTooltip && !hasTooltip) {
        self.tooltipEl?.remove();
        self.tooltipEl = null;
      }

      if (name) {
        self.tooltipEl.innerText = name;
      }
    };

    const onPointerEnter: EventListener = (evt) => {
      const mapObject = evt.target;
      if (mapObject instanceof H.map.Polygon) {
        const data = mapObject.getData();
        const id = data?.id;
        const isCurrent = id === self.selectedFeature;
        setHoveredFeature(id, data?.name);
        if (!isCurrent) {
          mapObject.setStyle(featureStyles.hover);
        }
      }
    };

    const onPointerLeave: EventListener = (evt) => {
      const mapObject = evt.target;
      if (mapObject instanceof H.map.Polygon) {
        const data = mapObject.getData();
        const id = data?.id;
        const isCurrent = id === self.selectedFeature;
        if (self.hoveredFeature?.id === id) {
          setHoveredFeature();
        }
        mapObject.setStyle(isCurrent ? featureStyles.selected : featureStyles.default);
      }
    };

    const onTap: EventListener = (evt) => {
      const mapObject = evt.target;
      if (mapObject instanceof H.map.Polygon) {
        const id = mapObject.getData()?.id;
        const { onFeatureSelect: callback } = self;
        if (callback && typeof id === "number") {
          callback(id);
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reader: H.data.AbstractReader = new (H.data as any).geojson.Reader(overlayUrl, {
      disableLegacyMode: true,
      style: (mapObject: H.map.Object) => {
        if (mapObject instanceof H.map.Polygon) {
          const data = mapObject.getData();
          mapObject.setStyle(data?.id === self.selectedFeature ? featureStyles.selected : featureStyles.default);
          mapObject.addEventListener("pointerenter", onPointerEnter);
          mapObject.addEventListener("pointerleave", onPointerLeave);
        }
      },
    });

    let group: H.map.Group;

    reader.addEventListener("statechange", () => {
      if (reader.getState() !== H.data.AbstractReader.State.READY) return;

      group = (reader.getParsedObjects().find((object) => {
        if (object instanceof H.map.Group) {
          return true;
        }
      }) as unknown) as H.map.Group;

      if (!group) return;

      const features = new Map<number, H.map.Polygon>();
      group.getObjects().forEach((object) => {
        if (object instanceof H.map.Polygon) {
          const id = object.getData()?.id;
          if (typeof id === "number") {
            features.set(id, object);
          }
        }
      });
      self.features = features;

      group.addEventListener("tap", onTap);
      map.addObject(group);
    });
    reader.parse();

    return () => {
      self.hoveredFeature = null;
      self.features = null;
      self.tooltipEl?.remove();
      self.tooltipEl = null;

      reader.dispose();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (group && !(map as any).disposed) {
        map.removeObject(group);
        group = null;
      }
    };
  }, [H, map, overlayUrl]);

  if (!H || !apiKey) {
    return null;
  }

  return <div className={classes.root} ref={mapRef} style={{ width, height }} />;
});
