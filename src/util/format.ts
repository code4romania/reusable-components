import { ElectionScopeResolved } from "../types/Election";

export const formatPercentage = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(x);

export const formatGroupedNumber = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    useGrouping: true,
  }).format(x);

export function getScopeName(scope: ElectionScopeResolved): string {
  switch (scope.type) {
    case "national":
      return "Nivel Național";
    case "county":
      return scope.countyName ? `Județul ${scope.countyName}` : "Județ";
    case "locality":
      return scope.localityName ? `Localitatea ${scope.localityName}` : "Localitate";
    case "diaspora":
      return "Diaspora";
    case "diaspora_country":
      return scope.countryName ? `Diaspora din ${scope.countryName}` : "Țară din Diaspora";
  }
}
