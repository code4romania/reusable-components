type IClassNames = { [key: string]: string };

declare module "*.module.scss" {
  const classes: IClassNames;
  export default classes;
}

declare module "*.module.css" {
  const classes: IClassNames;
  export default classes;
}
