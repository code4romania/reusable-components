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
