# Code4Romania React Reusable Components

[![GitHub contributors](https://img.shields.io/github/contributors/code4romania/reusable-components.svg?style=for-the-badge)](https://github.com/code4romania/reusable-components/graphs/contributors) [![GitHub last commit](https://img.shields.io/github/last-commit/code4romania/reusable-components.svg?style=for-the-badge)](https://github.com/code4romania/reusable-components/commits/master) [![License: MPL 2.0](https://img.shields.io/badge/license-MPL%202.0-brightgreen.svg?style=for-the-badge)](https://opensource.org/licenses/MPL-2.0)

The aim of the project is to publish a distribution of reusable frontend components that can be imported, customized and used in any Code4Romania project that would require them.

[See the project live](https://reusable-components-peach.vercel.app/)

As part of our ongoing development, we discovered that it is a lot simpler to develop frontend components that we can later customize and import in other projects, rather then reinventing and redeveloping the same components all over again in every project. This also helps us to aim for the same look and feel across projects.

[Contributing](#contributing) | [Built with](#built-with) | [Repos and projects](#repos-and-projects) | [Development](#development) | [Feedback](#feedback) | [License](#license) | [About Code4Ro](#about-code4ro)

## Contributing

This project is built by amazing volunteers and you can be one of them! Here's a list of ways in [which you can contribute to this project](https://github.com/code4romania/.github/blob/master/CONTRIBUTING.md). If you want to make any change to this repository, please **make a fork first**.

Help us out by testing this project in the [staging environment](https://reusable-components-peach.vercel.app/). If you see something that doesn't quite work the way you expect it to, open an Issue. Make sure to describe what you _expect to happen_ and _what is actually happening_ in detail.

If you would like to suggest new functionality, open an Issue and mark it as a __[Feature request]__. Please be specific about why you think this functionality will be of use. If you can, please include some visual description of what you would like the UI to look like, if you are suggesting new UI elements.

## Built With

### Programming languages

[TypeScript](https://www.typescriptlang.org)

### Frontend framework

[ReactJS](https://reactjs.org)

### Package managers

[npm](https://www.npmjs.com)

## Development

1. Install dependencies

```
npm install
```

2. Run storybook

```
npm run-script storybook
```

Preview environments available automatically on each PR powered by [Vercel](https://vercel.com/). Preview environment for `master` branch: https://reusable-components-peach.vercel.app/

## Concepts

### Stack

### CSS and theming

All the components in this repo are themed using [CSS Modules](https://github.com/css-modules/css-modules). In case you need to override any component's styles, pass the `classes` prop to any component individually or pass a theme to a `<ThemeProvider>`. See [theme.tsx](src/util/theme.tsx) for more details.

## Feedback

* Request a new feature on GitHub.
* Vote for popular feature requests.
* File a bug in GitHub Issues.
* Email us with other feedback contact@code4.ro

## License

This project is licensed under the MPL 2.0 License - see the [LICENSE](LICENSE) file for details

## About Code4Ro

Started in 2016, Code for Romania is a civic tech NGO, official member of the Code for All network. We have a community of over 500 volunteers (developers, ux/ui, communications, data scientists, graphic designers, devops, it security and more) who work pro-bono for developing digital solutions to solve social problems. #techforsocialgood. If you want to learn more details about our projects [visit our site](https://www.code4.ro/en/) or if you want to talk to one of our staff members, please e-mail us at contact@code4.ro.

Last, but not least, we rely on donations to ensure the infrastructure, logistics and management of our community that is widely spread across 11 timezones, coding for social change to make Romania and the world a better place. If you want to support us, [you can do it here](https://code4.ro/en/donate/).
