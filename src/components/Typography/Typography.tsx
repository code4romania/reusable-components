import React, { ComponentProps, ComponentType, forwardRef } from "react";
import { PropsObject, themable, ThemableComponent, ThemableComponentProps } from "../../util/theme";
import cssClasses from "./Typography.module.scss";

export function makeTypographyComponent<Props extends PropsObject>(
  Component: ComponentType<Props> | string,
  className: string,
  extraClassName?: string,
): ThemableComponent<Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component_: any = Component;
  return themable<Props>(
    "Typography",
    cssClasses,
  )(
    forwardRef(function TypographyInner({ classes, ...otherProps }: ThemableComponentProps<Props>, ref) {
      const ownClassName = classes[className];
      const finalClassName = extraClassName ? `${ownClassName} ${extraClassName}` : ownClassName;
      return <Component_ {...otherProps} className={finalClassName} ref={ref} />;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  );
}

export const Body = makeTypographyComponent<ComponentProps<"span">>("span", "body");
export const BodyMedium = makeTypographyComponent<ComponentProps<"span">>("span", "bodyMedium");
export const BodyLarge = makeTypographyComponent<ComponentProps<"span">>("span", "bodyLarge");
export const BodyHuge = makeTypographyComponent<ComponentProps<"span">>("span", "bodyHuge");
export const Label = makeTypographyComponent<ComponentProps<"span">>("span", "label");
export const LabelMedium = makeTypographyComponent<ComponentProps<"span">>("span", "labelMedium");
export const Heading1 = makeTypographyComponent<ComponentProps<"h1">>("h1", "h1");
export const Heading2 = makeTypographyComponent<ComponentProps<"h2">>("h2", "h2");
export const Heading3 = makeTypographyComponent<ComponentProps<"h3">>("h3", "h3");
