import { ElectionScopeIncompleteResolved } from "../types/Election";

export const formatPercentage = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    style: "percent",
    maximumFractionDigits: 2,
  })
    .format(x)
    .replace(/\s+%$/, "%");

export const formatGroupedNumber = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    useGrouping: true,
  }).format(x);

export function getScopeName(scope: ElectionScopeIncompleteResolved): string {
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

export const fractionOf = (x: number, total: number): number => {
  const percent = x / total;
  return Number.isFinite(percent) ? percent : 0;
};

function hashCode(s: string): number {
  let i, h;
  for (i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function mulberry32(a: number): () => number {
  return function (): number {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randomColor = (seed: string): string => {
  return `hsl(${mulberry32(hashCode(seed))() * 360.0}, 50%, 50%)`;
};

export const electionCandidateColor = (candidate: { name: string; partyColor?: string | null }): string =>
  candidate.partyColor ?? randomColor(candidate.name);
