/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { Body, BodyLarge, BodyMedium, Heading1, Heading2, Heading3, Label, LabelMedium } from "./Typography";

export default {
  title: "Typography primitives",
  subcomponents: [Body, BodyMedium, BodyLarge, Label, LabelMedium, Heading1, Heading2, Heading3],
};

export const SimpleExample = () => {
  return (
    <>
      <Heading1>Heading 1</Heading1>
      <div>
        <Body>This is body text</Body>
      </div>
      <div>
        <Label>This is a label</Label>
      </div>
      <Heading2>Heading 2</Heading2>
      <div>
        <BodyMedium>This is medium body text</BodyMedium>
      </div>
      <div>
        <LabelMedium>This is a medium label</LabelMedium>
      </div>
      <Heading3>Heading 3</Heading3>
      <div>
        <BodyLarge>This is large body text</BodyLarge>
      </div>
    </>
  );
};
