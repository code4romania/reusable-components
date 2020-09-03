export const formatPercentage = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(x);

export const formatGroupedNumber = (x: number): string =>
  new Intl.NumberFormat("ro-RO", {
    useGrouping: true,
  }).format(x);
