/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { themable, ThemedComponentProps } from "../../hooks/theme";
import cssClasses from "./HereMap.module.scss";
import Color from "color";

type OnFeatureSelect = (featureId: number) => unknown;
type RenderFeatureTooltip = (id: number, featureProps: any) => Node | string | null;

export type HereMapRect = {
  top: number; // Latitude
  left: number; // Longitude
  bottom: number; // Latitude
  right: number; // Longitude
};

export type HereMapTransform = {
  center?: { lat: number; lng: number };
  zoom?: number;
  bounds?: HereMapRect;
};

type Props = {
  className?: string;
  width: number;
  height: number;
  overlayUrl?: string;
  overlayData?: unknown;
  maskOverlayUrl?: string;
  getFeatureColor?: (id: number, featureProps: any) => string | null;
  renderFeatureTooltip?: RenderFeatureTooltip; // Returns a HTML element or string
  selectedFeature?: number | null | undefined;
  onFeatureSelect?: OnFeatureSelect;
  initialTransform?: HereMapTransform;
  overlayLoadTransform?: HereMapTransform | "bounds" | false; // Defaults to "bounds": the bounds of the loaded overlay
  allowZoomAndPan?: boolean;
  centerOnSelectedFeatureBounds?: boolean;
};

export const bucharestCenteredWorldZoom = {
  center: { lat: 44.4268, lng: 26.1025 },
  zoom: 2,
};

export const romaniaMapBounds = {
  bounds: {
    top: 48.26534497800004,
    bottom: 43.618995545000075,
    left: 20.261959895000075,
    right: 29.715232741000037,
  },
};

const makeRect = (H: HereMapsAPI, r: HereMapRect): H.geo.Rect => new H.geo.Rect(r.top, r.left, r.bottom, r.right);

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
  featureDefaultColor: "#aaaaaa",
  selectedFeatureColor: null, // Defaults to featureDefaultColor,
  featureSelectedDarken: 0.25,
  featureHoverDarken: 0.15,
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
  updateFeatureStyle: (feature: H.map.Polygon, selected: boolean, hover: boolean) => void;
  renderFeatureTooltip: RenderFeatureTooltip | undefined;
  overlayLoadTransform: HereMapTransform | "bounds" | false;
  centeredFeature: number | null;
};

const stylesFromColor = (H: HereMapsAPI, color: string, featureSelectedDarken: number, featureHoverDarken: number) => {
  return {
    default: new H.map.SpatialStyle({
      fillColor: color,
      strokeColor: "#ffffff",
      lineWidth: 1,
    }),
    selected: new H.map.SpatialStyle({
      fillColor: new Color(color).darken(featureSelectedDarken).toString(),
      strokeColor: "#ffffff",
      lineWidth: 2,
    }),
    hover: new H.map.SpatialStyle({
      fillColor: new Color(color).darken(featureHoverDarken).toString(),
      strokeColor: "#ffffff",
      lineWidth: 1,
    }),
  };
};

const setTooltipPosition = (self: InstanceVars, x: number, y: number) => {
  self.tooltipLeft = x;
  self.tooltipTop = y;
  if (self.tooltipEl) {
    self.tooltipEl.style.left = `${x}px`;
    self.tooltipEl.style.top = `${y}px`;
  }
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
    maskOverlayUrl,
    getFeatureColor,
    renderFeatureTooltip,
    selectedFeature,
    onFeatureSelect,
    initialTransform = romaniaMapBounds,
    overlayLoadTransform = "bounds",
    allowZoomAndPan = true,
    centerOnSelectedFeatureBounds = false,
  }: ThemedComponentProps<Props>) => {
    const H = useHereMaps();
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapObjects, setMapObjects] = useState<null | {
      map: H.Map;
      ui: H.ui.UI;
      zoomControl: H.ui.ZoomControl;
      behaviour: H.mapevents.Behavior;
    }>(null);

    const map = mapObjects?.map;

    const { featureDefaultColor, selectedFeatureColor, featureSelectedDarken, featureHoverDarken } = constants;

    const updateFeatureStyle = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!H) return () => {};

      const styleCache = new Map();

      return (feature: H.map.Polygon, selected: boolean, hover: boolean) => {
        const data = feature.getData();
        const id = data?.id;
        const color =
          (id !== null && getFeatureColor && getFeatureColor(id, data)) ||
          (selected && selectedFeatureColor) ||
          featureDefaultColor;
        let styles = styleCache.get(color);
        if (!styles) {
          styles = stylesFromColor(H, color, featureSelectedDarken, featureHoverDarken);
          styleCache.set(color, styles);
        }
        const style = selected ? styles.selected : hover ? styles.hover : styles.default;
        feature.setStyle(style);
      };
    }, [H, getFeatureColor, featureDefaultColor, selectedFeatureColor, featureSelectedDarken, featureHoverDarken]);

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
      updateFeatureStyle: updateFeatureStyle,
      renderFeatureTooltip: renderFeatureTooltip,
      overlayLoadTransform: overlayLoadTransform,
      centeredFeature: (centerOnSelectedFeatureBounds ? selectedFeature : null) ?? null,
    });

    useLayoutEffect(() => {
      if (!H || !mapRef.current) {
        return;
      }

      const self = inst.current;

      const blankLayer = new H.map.layer.Layer();
      const hMap = new H.Map(mapRef.current, blankLayer, {
        bounds: initialTransform.bounds ? makeRect(H, initialTransform.bounds) : undefined,
        center: initialTransform.center,
        zoom: initialTransform.zoom,
        noWrap: true,
        pixelRatio: window.devicePixelRatio || 1,
      });

      const hZoomControl = new H.ui.ZoomControl({ alignment: H.ui.LayoutAlignment.RIGHT_BOTTOM });
      const hBehaviour = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
      hBehaviour.disable();
      const hUI = new H.ui.UI(hMap);

      setMapObjects({
        map: hMap,
        zoomControl: hZoomControl,
        behaviour: hBehaviour,
        ui: hUI,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hMap.addEventListener("pointermove", (evt: any) => {
        const { offsetX = 0, offsetY = 0, pointerType } = evt.originalEvent;
        if (pointerType === "touch") return;
        setTooltipPosition(self, offsetX, offsetY);
      });

      return () => {
        hMap.dispose();
        (hMap as any).disposed = true; // eslint-disable-line @typescript-eslint/no-explicit-any
        setMapObjects((state) => (state?.map === hMap ? null : state));
      };
    }, [H, mapRef]);

    useLayoutEffect(() => {
      if (!H || !allowZoomAndPan || !mapObjects || (mapObjects.map as any).disposed) return;
      const { ui, zoomControl, behaviour } = mapObjects;

      behaviour.enable();
      ui.addControl("zoomControl", zoomControl);

      return () => {
        if ((mapObjects.map as any).disposed) return;
        behaviour.disable();
        ui.removeControl("zoomControl");
      };
    }, [H, allowZoomAndPan, mapObjects]);

    useLayoutEffect(() => {
      if (map) {
        map.getViewPort().resize();
      }
    }, [width, height, map]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.centeredFeature = (centerOnSelectedFeatureBounds ? selectedFeature : null) ?? null;

      if (!map) return;

      const { features, centeredFeature } = self;
      if (!features || centeredFeature == null) return;

      const feature = features.get(centeredFeature);
      if (!feature) return;

      map.getViewModel().setLookAtData({ bounds: feature.getBoundingBox() }, true);
    }, [centerOnSelectedFeatureBounds, selectedFeature, map]);

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
      inst.current.overlayLoadTransform = overlayLoadTransform;
    }, [overlayLoadTransform]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.tooltipClassName = classes.tooltip;
      if (self.tooltipEl) {
        self.tooltipEl.className = classes.tooltip;
      }
    }, [classes.tooltip]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.updateFeatureStyle = updateFeatureStyle;

      self.features?.forEach((feature) => {
        const id = feature.getData()?.id;
        updateFeatureStyle(
          feature,
          id != null && id === self.selectedFeature,
          id != null && id === self.hoveredFeature?.id,
        );
      });
    }, [updateFeatureStyle]);

    useLayoutEffect(() => {
      const self = inst.current;
      self.renderFeatureTooltip = renderFeatureTooltip;
    }, [renderFeatureTooltip]);

    useLayoutEffect(() => {
      if (!H || !map || (!overlayUrl && !overlayData)) return;
      const self = inst.current;

      const setHoveredFeature = (id: number | null, props: any) => {
        const hadTooltip = !!self.hoveredFeature;
        const renderFeatureTooltip_ = self.renderFeatureTooltip;
        const tooltipData = id != null && renderFeatureTooltip_ ? renderFeatureTooltip_(id, props) : null;
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
          if (id == null) return;
          if (self.hoveredFeature?.id !== id) setHoveredFeature(id, data);
          self.updateFeatureStyle(mapObject, id === self.selectedFeature, true);

          if ((evt as any)?.originalEvent?.pointerType === "touch") {
            const bounds = mapObject.getBoundingBox();
            const { x, y } = map.geoToScreen({ lat: bounds.getTop(), lng: bounds.getCenter().lng });
            setTooltipPosition(self, x, y - 5);
          }
        }
      };

      const onPointerLeave: EventListener = (evt) => {
        const mapObject = evt.target;
        if (mapObject instanceof H.map.Polygon) {
          const data = mapObject.getData();
          const id = data?.id;
          if (self.hoveredFeature?.id === id) setHoveredFeature(null, null);
          self.updateFeatureStyle(mapObject, id != null && id === self.selectedFeature, false);
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
            const id = data?.id;
            self.updateFeatureStyle(mapObject, id != null && id === self.selectedFeature, false);
            mapObject.addEventListener("pointerenter", onPointerEnter);
            mapObject.addEventListener("pointerleave", onPointerLeave);
          }
        },
      });

      let group: H.map.Group | null = null;

      reader.addEventListener("statechange", () => {
        if (reader.getState() !== H.data.AbstractReader.State.READY) return;

        group = reader.getParsedObjects().find((object) => {
          if (object instanceof H.map.Group) {
            return true;
          }
        }) as unknown as H.map.Group;

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

        if (self.centeredFeature != null) {
          const feature = features.get(self.centeredFeature);
          if (feature) {
            map.getViewModel().setLookAtData({ bounds: feature.getBoundingBox() }, true);
          }
        } else {
          const newTransform = self.overlayLoadTransform;
          if (newTransform) {
            map.getViewModel().setLookAtData(
              newTransform === "bounds"
                ? { bounds: group.getBoundingBox() }
                : {
                    bounds: newTransform.bounds ? makeRect(H, newTransform.bounds) : undefined,
                    position: newTransform.center,
                    zoom: newTransform.zoom,
                  },
              true,
            );
          }
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

    useLayoutEffect(() => {
      if (!H || !map || !maskOverlayUrl) return;
      const reader: H.data.AbstractReader = new (H.data as any).geojson.Reader(maskOverlayUrl, {
        disableLegacyMode: true,
        style: (mapObject: H.map.Object) => {
          if (mapObject instanceof H.map.Polygon) {
            mapObject.setStyle({
              fillColor: "#ffffff",
              strokeColor: "#ffffff",
              lineWidth: 0,
            });
          }
        },
      });

      reader.parse();
      const layer = reader.getLayer();
      map.addLayer(layer);

      return () => {
        reader.dispose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(map as any).disposed) {
          map.removeLayer(layer);
        }
      };
    }, [H, map, maskOverlayUrl]);

    if (!H) {
      return null;
    }

    return <div className={classes.root} ref={mapRef} style={{ width, height }} />;
  },
);
