import React from "react";
import { CountyLocalitySelect } from "./CountyLocalitySelect";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  title: "County Locality Select",
  component: CountyLocalitySelect,
};

export const SimpleExample = () => {
  const counties = [
    { id: "national", label: "ARAD", countyName: "ARAD" },
    { id: "national", label: "BIHOR", countyName: "BIHOR" },
    { id: "national", label: "BRAȘOV", countyName: "BRAȘOV" },
    { id: "national", label: "CLUJ", countyName: "CLUJ" },
    { id: "national", label: "IAȘI", countyName: "IAȘI" },
    { id: "national", label: "SIBIU", countyName: "SIBIU" },
    { id: "national", label: "TIMIȘ", countyName: "TIMIȘ" },
  ];

  const localities = [
    { id: "BRAȘOV", label: "BRAȘOV", localityName: "BRAȘOV", countyName: "BRAȘOV" },
    { id: "ARAD", label: "ARAD", localityName: "ARAD", countyName: "ARAD" },
    { id: "ORADEA", label: "ORADEA", localityName: "ORADEA", countyName: "BIHOR" },
    { id: "CLUJ-NAPOCA", label: "CLUJ-NAPOCA", localityName: "CLUJ-NAPOCA", countyName: "CLUJ" },
    { id: "HUEDIN", label: "HUEDIN", localityName: "HUEDIN", countyName: "CLUJ" },
    { id: "IAȘI", label: "IAȘI", localityName: "IAȘI", countyName: "IAȘI" },
    { id: "TIMIȘOARA", label: "TIMIȘOARA", localityName: "TIMIȘOARA", countyName: "TIMIȘ" },
    { id: "SIBIU", label: "SIBIU", localityName: "SIBIU", countyName: "SIBIU" },
  ];

  return <CountyLocalitySelect counties={counties} localities={localities} />;
};
