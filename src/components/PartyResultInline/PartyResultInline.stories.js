import React from "react";
import { PartyResultInline } from "./PartyResultInline.tsx";

export default {
  title: "Party Result Inline",
  component: PartyResultInline,
};

export const SimpleExample = () => {
  const color = "#ff0000";
  const name = "PSD";
  return <PartyResultInline color={color} name={name} percentage={23.56} votesCount={2000000} />;
};
