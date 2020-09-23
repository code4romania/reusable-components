import React from "react";

import { withConsole } from "@storybook/addon-console";
import { HereMapsAPIKeyProvider } from "../src/components/HereMap/HereMap";
import { ElectionMapOverlayURLContext } from "../src/components/ElectionMap/ElectionMap";
import { electionMapOverlayUrl } from "../src/constants/servers";

import "./storybook.css";

export const decorators = [
  (storyFn, context) => withConsole()(storyFn)(context),
  (storyFn, context) => (
    <ElectionMapOverlayURLContext.Provider
      value={process.env.STORYBOOK_ELECTION_MAP_OVERLAY_URL || electionMapOverlayUrl}
    >
      <HereMapsAPIKeyProvider value={process.env.STORYBOOK_HEREMAPS_API_KEY}>{storyFn(context)}</HereMapsAPIKeyProvider>
    </ElectionMapOverlayURLContext.Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
