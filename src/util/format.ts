import { DIASPORA, ElectionScope } from "../types/Election";

export const formatPercentage = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(x);

export const formatGroupedNumber = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    useGrouping: true,
  }).format(x);

export function getScopeName(scope: ElectionScope): string {
  switch (scope.type) {
    case "national":
      return "Nivel Național";
    case "county":
      return scope.county === DIASPORA ? "Diaspora" : `Județul ${scope.county}`;
    case "uat":
      return scope.county === DIASPORA
        ? `Diaspora din ${scope.uat}`
        : `Unitatea administrativ-teritorială ${scope.uat}`;
    case "city":
      return `Localitatea ${scope.city}`;
  }
}
