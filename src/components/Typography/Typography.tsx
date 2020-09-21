import React, { ComponentProps, ComponentType, forwardRef } from "react";
import { mergeClasses, PropsObject, themable, ThemableComponent, ThemedComponentProps } from "../../util/theme";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    forwardRef(function TypographyInner({ classes, constants, ...otherProps }: ThemedComponentProps<Props>, ref) {
      const finalClassName = mergeClasses(mergeClasses(classes[className], extraClassName), classes.root);
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
export const DivBody = makeTypographyComponent<ComponentProps<"div">>("div", "body");
export const DivBodyMedium = makeTypographyComponent<ComponentProps<"div">>("div", "bodyMedium");
export const DivBodyLarge = makeTypographyComponent<ComponentProps<"div">>("div", "bodyLarge");
export const DivBodyHuge = makeTypographyComponent<ComponentProps<"div">>("div", "bodyHuge");
export const DivLabel = makeTypographyComponent<ComponentProps<"div">>("div", "label");
export const DivLabelMedium = makeTypographyComponent<ComponentProps<"div">>("div", "labelMedium");
export const DivHeading1 = makeTypographyComponent<ComponentProps<"h1">>("div", "h1");
export const DivHeading2 = makeTypographyComponent<ComponentProps<"h2">>("div", "h2");
export const DivHeading3 = makeTypographyComponent<ComponentProps<"h3">>("div", "h3");
export const Underlined = makeTypographyComponent<ComponentProps<"span">>("span", "underlined");
