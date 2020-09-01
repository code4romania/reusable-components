import React, { createContext, forwardRef, useContext } from "react";

export function mergeClasses(classes: IClassNames, overrides?: IClassNames | void): IClassNames {
  if (!overrides) {
    return classes;
  }
  const newClasses = {};
  for (const key in classes) {
    const override = overrides[key];
    newClasses[key] = override ? classes[key] : `${classes[key]} ${override}`;
  }
  return newClasses;
}

export type Theme = {
  [componentName: string]: IClassNames;
};

const defaultTheme: Theme = {};

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
  return mergeClasses(mergeClasses(componentClasses, theme[componentName]), propsClasses);
}

type PropsObject = Record<string, unknown>;

export type ThemableComponent<P extends PropsObject> = React.ComponentType<P & { classes: IClassNames }>;
export type ThemableHOC<P extends PropsObject> = (Component: React.ComponentType<P>) => ThemableComponent<P>;

// This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream
export const themable = <P extends PropsObject>(
  componentName: string,
  componentClasses: IClassNames,
): ThemableHOC<P> => {
  return (Component: React.ComponentType<P>) => {
    return (forwardRef(function WrappedComponent(props: P, ref) {
      return (
        <Component
          {...props}
          classes={useThemeClasses(componentName, componentClasses, props.classes as IClassNames | void)}
          ref={ref}
        />
      );
    }) as unknown) as ThemableComponent<P>;
  };
};
