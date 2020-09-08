import React from 'react';
import '@storybook/addon-console'

import { withConsole } from '@storybook/addon-console';
import { HereMapsAPIKeyProvider } from '../src/components/ElectionMap/ElectionMap';

import "./storybook.css";

export const decorators = [
  (storyFn, context) => withConsole()(storyFn)(context),
  (Story) => (
    <HereMapsAPIKeyProvider value={process.env.STORYBOOK_HEREMAPS_API_KEY}>
      <Story />
    </HereMapsAPIKeyProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
