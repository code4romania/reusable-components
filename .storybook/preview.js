import React from "react";

import { withConsole } from "@storybook/addon-console";
import { HereMapsAPIKeyProvider } from "../src/components/ElectionMap/HereMap";

import "./storybook.css";

export const decorators = [
  (storyFn, context) => withConsole()(storyFn)(context),
  (storyFn, context) => (
    <HereMapsAPIKeyProvider value={process.env.STORYBOOK_HEREMAPS_API_KEY}>{storyFn(context)}</HereMapsAPIKeyProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
