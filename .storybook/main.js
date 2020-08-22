module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/react",
    "@storybook/preset-scss",
    "@storybook/addon-docs",
    "@storybook/addon-storysource",
    "@storybook/addon-knobs/register",
    "@storybook/addon-viewport/register"
  ]
};