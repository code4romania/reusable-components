import { useMemo } from "react";
import { ElectionScope } from "../types/Election";

export const scopeArgTypes = {
  scopeType: {
    defaultValue: "national",
    control: {
      type: "radio",
      options: ["national", "county", "locality", "diaspora", "diaspora_country"],
    },
  },
  countyId: {
    defaultValue: 1,
    control: "number",
  },
  localityId: {
    defaultValue: 1,
    control: "number",
  },
  countryId: {
    defaultValue: 1,
    control: "number",
  },
};

export const buildScope = (
  scopeType: ElectionScope["type"],
  countyId: number,
  localityId: number,
  countryId: number,
): ElectionScope => {
  switch (scopeType) {
    case "national":
      return { type: "national" };
    case "county":
      return { type: "county", countyId };
    case "locality":
      return { type: "locality", countyId, localityId };
    case "diaspora":
      return { type: "diaspora" };
    case "diaspora_country":
      return { type: "diaspora_country", countryId };
    default:
      return { type: "national" };
  }
};

export type ScopeArgs = {
  scopeType: ElectionScope["type"];
  countyId: number;
  localityId: number;
  countryId: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const scopeFromArgs = (args: ScopeArgs & Record<string, any>): [ElectionScope, Record<string, any>] => {
  const { scopeType, countyId, localityId, countryId, ...otherArgs } = args;
  return [buildScope(scopeType, countyId, localityId, countryId), otherArgs];
};

// Same as scopeFromArgs, but memoizes the scope
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useScopeFromArgs = (args: ScopeArgs & Record<string, any>): [ElectionScope, Record<string, any>] => {
  const { scopeType, countyId, localityId, countryId, ...otherArgs } = args;
  const scope = useMemo(() => buildScope(scopeType, countyId, localityId, countryId), [
    scopeType,
    countyId,
    localityId,
    countryId,
  ]);
  return [scope, otherArgs];
};
