declare module "*.svg" {
  import { ComponentType, SVGAttributes } from "react";
  const SvgComponent: ComponentType<SVGAttributes<SVGElement>>;
  export default SvgComponent;
}
