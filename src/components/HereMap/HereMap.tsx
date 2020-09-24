/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { themable } from "../../hooks/theme";
import cssClasses from "./HereMap.module.scss";
import Color from "color";

type OnFeatureSelect = (featureId: number) => unknown;

type Props = {
  className?: string;
  width: number;
  height: number;
  overlayUrl?: string;
  overlayData?: unknown;
  getFeatureColor?: (id: number, featureProps: any) => string | null;
  renderFeatureTooltip?: (id: number, featureProps: any) => Node | string | null; // Returns a HTML element or string
  selectedFeature?: number | null | undefined;
  onFeatureSelect?: OnFeatureSelect;
  initialBounds?: {
    top: number; // Latitude
    left: number; // Longitude
    bottom: number; // Latitude
    right: number; // Longitude
  };
  centerOnOverlayBounds?: boolean; // Default true
};

export const worldMapBounds = { top: 90, left: 0, bottom: -90, right: 180 };
export const romaniaMapBounds = {
  top: 48.26534497800004,
  bottom: 43.618995545000075,
  left: 20.261959895000075,
  right: 29.715232741000037,
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

let hereMapsPromise: Promise<HereMapsAPI> | null = null;
const getHereMaps = (): Promise<HereMapsAPI> => {
  if (hereMapsPromise) {
    return hereMapsPromise;
  }
  hereMapsPromise = loadHereMaps();
  return hereMapsPromise;
};

getHereMaps(); // Load on startup

const useHereMaps = (): HereMapsAPI | null => {
  const [savedH, setH] = useState<HereMapsAPI | null>(null);
  useEffect(() => {
    let set: typeof setH | null = setH;
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
  featureDefaultColor: "#FFCC00",
  selectedFeatureColor: null, // Defaults to featureDefaultColor,
  featureFillAlpha: 0.3,
  featureFillHoverAlpha: 0.6,
};

type InstanceVars = {
  selectedFeature: number | undefined | null;
  hoveredFeature: { id: number; props: any } | null;
  onFeatureSelect: OnFeatureSelect | undefined | null;
  group: H.map.Group | null;
  features: Map<number, H.map.Polygon> | null;
  tooltipEl: HTMLDivElement | null;
  tooltipClassName: string | null;
  tooltipTop: number;
  tooltipLeft: number;
  centerOnOverlayBounds: boolean;
};

const stylesFromColor = (H: HereMapsAPI, color: string, defaultAlpha: number, hoverAlpha: number) => {
  return {
    default: new H.map.SpatialStyle({
      fillColor: new Color(color).fade(1.0 - defaultAlpha).toString(),
      strokeColor: color,
      lineWidth: 2,
    }),
    selected: new H.map.SpatialStyle({
      fillColor: color,
      strokeColor: color,
      lineWidth: 2,
    }),
    hover: new H.map.SpatialStyle({
      fillColor: new Color(color).fade(1.0 - hoverAlpha).toString(),
      strokeColor: color,
      lineWidth: 2,
    }),
  };
};

export const HereMap = themable<Props>(
  "HereMap",
  cssClasses,
  defaultValues,
)(
  ({
    classes,
    constants,
    width,
    height,
    overlayUrl,
    overlayData,
    getFeatureColor,
    renderFeatureTooltip,
    selectedFeature,
    onFeatureSelect,
    initialBounds = worldMapBounds,
    centerOnOverlayBounds = true,
  }) => {
    const H = useHereMaps();
    const apiKey = useContext(HereMapsAPIKeyContext);
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<H.Map | null>(null);

    const { featureDefaultColor, selectedFeatureColor, featureFillAlpha, featureFillHoverAlpha } = constants;

    const updateFeatureStyle = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!H) return () => {};

      const styleCache = new Map();

      return (feature: H.map.Polygon, selected: boolean, hover: boolean) => {
        const data = feature.getData();
        const id = data?.id;
        if (id == null) return;
        const color =
          (getFeatureColor && getFeatureColor(id, data)) || (selected && selectedFeatureColor) || featureDefaultColor;
        let styles = styleCache.get(color);
        if (!styles) {
          styles = stylesFromColor(H, color, featureFillAlpha, featureFillHoverAlpha);
          styleCache.set(color, styles);
        }
        const style = selected ? styles.selected : hover ? styles.hover : styles.default;
        feature.setStyle(style);
      };
    }, [H, getFeatureColor, featureDefaultColor, selectedFeatureColor, featureFillAlpha, featureFillHoverAlpha]);

    // Instance vars
    const inst = useRef<InstanceVars>({
      selectedFeature,
      hoveredFeature: null,
      onFeatureSelect,
      group: null,
      features: null,
      tooltipEl: null,
      tooltipClassName: classes.tooltip ?? null,
      tooltipTop: 0,
      tooltipLeft: 0,
      centerOnOverlayBounds,
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
        bounds: new H.geo.Rect(initialBounds.top, initialBounds.left, initialBounds.bottom, initialBounds.right),
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

      // De-select previously selected feature
      if (features && typeof lastSelectedFeature === "number") {
        const feature = features.get(lastSelectedFeature);
        if (feature) {
          updateFeatureStyle(feature, false, lastSelectedFeature === hoveredFeature?.id);
        }
      }

      // Select new feature
      if (features && typeof selectedFeature === "number") {
        const feature = features.get(selectedFeature);
        if (feature) {
          updateFeatureStyle(feature, true, false);
        }
      }
    }, [selectedFeature]);

    useLayoutEffect(() => {
      inst.current.onFeatureSelect = onFeatureSelect;
    }, [onFeatureSelect]);

    useLayoutEffect(() => {
      inst.current.centerOnOverlayBounds = centerOnOverlayBounds;
    }, [centerOnOverlayBounds]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.tooltipClassName = classes.tooltip;
      if (self.tooltipEl) {
        self.tooltipEl.className = classes.tooltip;
      }
    }, [classes.tooltip]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.features?.forEach((feature) => {
        const id = feature.getData()?.id;
        updateFeatureStyle(feature, id === self.selectedFeature, id === self.hoveredFeature?.id);
      });
    }, [updateFeatureStyle]);

    useLayoutEffect(() => {
      if (!H || !map || (!overlayUrl && !overlayData)) return;
      const self = inst.current;

      const setHoveredFeature = (id: number | null, props: any) => {
        const hadTooltip = !!self.hoveredFeature;
        const tooltipData = id != null && renderFeatureTooltip ? renderFeatureTooltip(id, props) : null;
        const hasTooltip = !!tooltipData;
        self.hoveredFeature = id != null ? { id, props } : null;

        if (!hadTooltip && hasTooltip) {
          const tooltipEl = document.createElement("div");
          tooltipEl.className = self.tooltipClassName || "";
          tooltipEl.style.left = `${self.tooltipLeft}px`;
          tooltipEl.style.top = `${self.tooltipTop}px`;
          mapRef.current?.appendChild(tooltipEl);
          self.tooltipEl = tooltipEl;
        } else if (hadTooltip && !hasTooltip) {
          self.tooltipEl?.remove();
          self.tooltipEl = null;
        }

        const { tooltipEl } = self;
        if (tooltipData && tooltipEl) {
          if (typeof tooltipData === "string") {
            tooltipEl.innerHTML = tooltipData;
          } else {
            tooltipEl.textContent = null;
            tooltipEl.appendChild(tooltipData);
          }
        }
      };

      const onPointerEnter: EventListener = (evt) => {
        const mapObject = evt.target;
        if (mapObject instanceof H.map.Polygon) {
          const data = mapObject.getData();
          const id = data?.id;
          if (self.hoveredFeature?.id !== id) setHoveredFeature(id, data);
          updateFeatureStyle(mapObject, id === self.selectedFeature, true);
        }
      };

      const onPointerLeave: EventListener = (evt) => {
        const mapObject = evt.target;
        if (mapObject instanceof H.map.Polygon) {
          const data = mapObject.getData();
          const id = data?.id;
          if (self.hoveredFeature?.id === id) setHoveredFeature(null, null);
          updateFeatureStyle(mapObject, id === self.selectedFeature, false);
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
      const reader: H.data.AbstractReader = new (H.data as any).geojson.Reader(overlayData || overlayUrl, {
        disableLegacyMode: true,
        style: (mapObject: H.map.Object) => {
          if (mapObject instanceof H.map.Polygon) {
            const data = mapObject.getData();
            updateFeatureStyle(mapObject, data?.id === self.selectedFeature, false);
            mapObject.addEventListener("pointerenter", onPointerEnter);
            mapObject.addEventListener("pointerleave", onPointerLeave);
          }
        },
      });

      let group: H.map.Group | null = null;

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

        if (self.centerOnOverlayBounds) {
          map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() }, true);
        }
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
  },
);
