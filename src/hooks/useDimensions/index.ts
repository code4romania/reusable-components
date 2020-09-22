/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useLayoutEffect } from "react";
import { DimensionObject, UseDimensionsArgs, UseDimensionsHook } from "./types";

function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: "x" in rect ? rect.x : (rect as any).top,
    left: "y" in rect ? rect.y : (rect as any).left,
    x: "x" in rect ? rect.x : (rect as any).left,
    y: "y" in rect ? rect.y : (rect as any).top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

export function useDimensions({ liveMeasure = true }: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((nd) => {
    setNode(nd);
  }, []);

  useLayoutEffect(() => {
    if (!node) {
      return;
    }

    const measure = () => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node)));
    measure();

    if (liveMeasure) {
      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(node);

        return resizeObserver.disconnect;
      } else {
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure);

        return () => {
          window.removeEventListener("resize", measure);
          window.removeEventListener("scroll", measure);
        };
      }
    }
  }, [node]);

  return [ref, dimensions, node];
}
