import { ElectionScope } from "../types/Election";

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
      return `Județul ${scope.county}`;
    case "city":
      return `Localitatea ${scope.city}`;
    case "diaspora":
      return "Diaspora";
    case "diaspora_country":
      return `Diaspora din ${scope.country}`;
  }
}
