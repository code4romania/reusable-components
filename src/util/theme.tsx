import React, { createContext, forwardRef, useContext } from "react";

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

export type Theme = {
  [componentName: string]: IClassNames;
};

const defaultTheme: Theme = {
  colors: {
    primary: "#FFCC00",
    secondary: "#352245",
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
export const ThemeProvider = ThemeContext.Provider;

export function useThemeClasses(
  componentName: string,
  componentClasses: IClassNames,
  propsClasses?: IClassNames | void,
): IClassNames {
  const theme = useTheme();
  return overrideClasses(overrideClasses(componentClasses, theme[componentName]), propsClasses);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type PropsObject = object;

export type ThemableComponentProps<P extends PropsObject> = P & { classes?: IClassNames };
export type ThemableComponent<P extends PropsObject> = React.ComponentType<ThemableComponentProps<P>>;
export type ThemedComponentProps<P extends PropsObject> = P & { classes: IClassNames };
export type ThemedComponent<P extends PropsObject> = React.ComponentType<ThemedComponentProps<P>>;
export type ThemableHOC<P extends PropsObject> = (Component: ThemedComponent<P>) => ThemableComponent<P>;

// This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream
export const themable = <P extends PropsObject>(
  componentName: string,
  componentClasses: IClassNames,
): ThemableHOC<P> => {
  return (Component: ThemedComponent<P>) => {
    return (forwardRef(function WrappedComponent(props: ThemableComponentProps<P>, ref) {
      return (
        <Component {...props} classes={useThemeClasses(componentName, componentClasses, props.classes)} ref={ref} />
      );
    }) as unknown) as ThemableComponent<P>;
  };
};
