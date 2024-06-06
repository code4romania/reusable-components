import React, { createContext, forwardRef, useContext, useMemo } from "react";

export type ClassNames = { [key: string]: string };

export function mergeClasses(
  a: string | null | undefined | false,
  b: string | null | undefined | false,
): string | undefined {
  if (!a) {
    return b || undefined;
  }
  if (!b) {
    return a || undefined;
  }
  return `${a} ${b}`;
}

export function overrideClasses(classes: ClassNames, overrides?: ClassNames | void): ClassNames {
  if (!overrides) {
    return classes;
  }
  const newClasses = Object.assign({}, classes);
  for (const key in overrides) {
    const mergedClasses = mergeClasses(newClasses[key], overrides[key]);
    if (mergedClasses) {
      newClasses[key] = mergedClasses;
    }
  }
  return newClasses;
}

export interface Theme extends ThemeConstants {
  colors: {
    primary: string;
    primary75: string;
    primary50: string;
    primary25: string;
    secondary: string;
  };
  componentClasses: {
    [componentName: string]: ClassNames;
  };
  componentValues: {
    [componentName: string]: ThemeConstants;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: "#FFCC00",
    primary75: "#FFCC00AF",
    primary50: "#FFCC007F",
    primary25: "#FFCC003F",
    secondary: "#352245",
  },
  componentClasses: {},
  componentValues: {},
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
export const ThemeProvider = ThemeContext.Provider;

export function mergeThemeClasses(
  theme: Theme,
  componentName: string,
  componentClasses?: ClassNames | void,
  propsClasses?: ClassNames | void,
  propsClassName?: string | void,
): ClassNames {
  let classes = overrideClasses(componentClasses || {}, theme.componentClasses[componentName]);
  classes = overrideClasses(classes, propsClasses);
  if (propsClassName) {
    classes = overrideClasses(classes, { root: propsClassName });
  }
  return classes;
}

const mergeConstants = (a?: ThemeConstants | void, b?: ThemeConstants | void): ThemeConstants | void => {
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }
  const result = { ...a };
  for (const key in b) {
    const value = b[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

const emptyValues: ThemeConstants = {};

export function mergeThemeConstants(
  theme: Theme,
  componentName: string,
  componentValues?: ThemeConstants | void,
  propsValues?: ThemeConstants | void,
): ThemeConstants {
  let values = mergeConstants(componentValues, theme.componentValues[componentName]);
  values = mergeConstants(values, propsValues) || emptyValues;
  return values;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type PropsObject = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThemeConstants = { [key: string]: any };

export type ThemableComponentProps<P extends PropsObject> = P & {
  className?: string;
  classes?: ClassNames;
  constants?: ThemeConstants;
};
export type ThemableComponent<P extends PropsObject> = React.ComponentType<ThemableComponentProps<P>>;
export type ThemedComponentProps<P extends PropsObject> = P & { classes: ClassNames; constants: ThemeConstants };
export type ThemedComponent<P extends PropsObject> = React.ComponentType<ThemedComponentProps<P>>;
export type ThemableHOC<P extends PropsObject> = (Component: ThemedComponent<P>) => ThemableComponent<P>;

// This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream
export const themable = <P extends PropsObject>(
  componentName: string,
  componentClasses?: ClassNames,
  componentValues?: ThemeConstants,
): ThemableHOC<P> => {
  return (Component: ThemedComponent<P>) => {
    return forwardRef(function WrappedComponent(props: ThemableComponentProps<P>, ref) {
      const theme = useTheme();
      const classes = useMemo(
        () => mergeThemeClasses(theme, componentName, componentClasses, props.classes, props.className),
        [theme, props.classes, props.className],
      );
      const constants = useMemo(
        () => mergeThemeConstants(theme, componentName, componentValues, props.constants),
        [theme, props.constants],
      );
      return <Component {...props} classes={classes} constants={constants} ref={ref} />;
    }) as unknown as ThemableComponent<P>;
  };
};
