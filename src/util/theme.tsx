import React, { createContext, forwardRef, useContext, useMemo } from "react";

export function mergeClasses(a: string | void, b: string | void): string | undefined {
  if (!a) {
    return b || undefined;
  }
  if (!b) {
    return a || undefined;
  }
  return `${a} ${b}`;
}

export function overrideClasses(classes: IClassNames, overrides?: IClassNames | void): IClassNames {
  if (!overrides) {
    return classes;
  }
  const newClasses = Object.assign({}, classes);
  for (const key in overrides) {
    newClasses[key] = mergeClasses(newClasses[key], overrides[key]);
  }
  return newClasses;
}

export interface Theme extends ThemeValues {
  colors: {
    primary: string;
    secondary: string;
  };
  componentClasses: {
    [componentName: string]: IClassNames;
  };
  componentValues: {
    [componentName: string]: ThemeValues;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: "#FFCC00",
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
  componentClasses?: IClassNames | void,
  propsClasses?: IClassNames | void,
  propsClassName?: string | void,
): IClassNames {
  let classes = overrideClasses(componentClasses || {}, theme.componentClasses[componentName]);
  classes = overrideClasses(classes, propsClasses);
  if (propsClassName) {
    classes = overrideClasses(classes, { root: propsClassName });
  }
  return classes;
}

const mergeValues = (a?: ThemeValues | void, b?: ThemeValues | void): ThemeValues | void => {
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }
  return Object.assign({}, a, b);
};

const emptyValues: ThemeValues = {};

export function mergeThemeValues(
  theme: Theme,
  componentName: string,
  componentValues?: ThemeValues | void,
  propsValues?: ThemeValues | void,
): ThemeValues {
  let values = mergeValues(componentValues, theme.componentValues[componentName]);
  values = mergeValues(values, propsValues) || emptyValues;
  return values;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type PropsObject = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThemeValues = { [key: string]: any };

export type ThemableComponentProps<P extends PropsObject> = P & {
  className?: string;
  classes?: IClassNames;
  themeValues?: ThemeValues;
};
export type ThemableComponent<P extends PropsObject> = React.ComponentType<ThemableComponentProps<P>>;
export type ThemedComponentProps<P extends PropsObject> = P & { classes: IClassNames; themeValues: ThemeValues };
export type ThemedComponent<P extends PropsObject> = React.ComponentType<ThemedComponentProps<P>>;
export type ThemableHOC<P extends PropsObject> = (Component: ThemedComponent<P>) => ThemableComponent<P>;

// This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream
export const themable = <P extends PropsObject>(
  componentName: string,
  componentClasses?: IClassNames,
  componentValues?: ThemeValues,
): ThemableHOC<P> => {
  return (Component: ThemedComponent<P>) => {
    return (forwardRef(function WrappedComponent(props: ThemableComponentProps<P>, ref) {
      const theme = useTheme();
      const classes = useMemo(
        () => mergeThemeClasses(theme, componentName, componentClasses, props.classes, props.className),
        [theme, props.classes, props.className],
      );
      const themeValues = useMemo(() => mergeThemeValues(theme, componentName, componentValues, props.themeValues), [
        theme,
        props.themeValues,
      ]);
      return <Component {...props} classes={classes} themeValues={themeValues} ref={ref} />;
    }) as unknown) as ThemableComponent<P>;
  };
};
