declare module "react-use-dimensions" {
  interface DimensionObject {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    x?: number;
    y?: number;
    right?: number;
    bottom?: number;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  type UseDimensionsHook = [(ref: HTMLElement | null) => void, DimensionObject, HTMLElement];

  interface UseDimensionsArgs {
    liveMeasure?: boolean;
  }

  const useDimensions: (args?: UseDimensionsArgs) => UseDimensionsHook;
  export default useDimensions;
}
