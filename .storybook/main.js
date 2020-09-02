module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/react",
    {
      name: "@storybook/preset-scss",
      options: { cssLoaderOptions: { modules: { auto: true } } },
    },
    "@storybook/addon-storysource",
    "@storybook/addon-knobs/register",
  ],
};
