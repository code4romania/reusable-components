import { Election, ElectionMeta, ElectionScope } from "../types/Election";
import { APIInvocation, JSONFetch, makeJsonFetch } from "./api";

const productionApiUrl = "https://example.com"; // TODO

export interface ElectionScopeAPI {
  getCounties: () => APIInvocation<{ id: number; name: string }[]>;
  getLocalities: (countyId: number) => APIInvocation<{ id: number; name: string }[]>;
  getCountries: () => APIInvocation<{ id: number; name: string }[]>;
}

export interface ElectionAPI extends ElectionScopeAPI {
  getElection: (id: string, scope: ElectionScope) => APIInvocation<Election>;
  getElections: () => APIInvocation<{ id: string; meta: ElectionMeta }[]>;
}

export const makeElectionApi = (options?: {
  apiUrl?: string;
  fetch?: JSONFetch; // for optional mocking
}): ElectionAPI => {
  const fetch = options?.fetch ?? makeJsonFetch(options?.apiUrl ?? productionApiUrl);
  return {
    getElection: (id, scope) => fetch("GET", `/elections/${id}`, { query: scope }),
    getElections: () => fetch("GET", "/elections"),
    getCounties: () => fetch("GET", "/counties"),
    getLocalities: (countyId) => fetch("GET", `/counties/${countyId}/localities`),
    getCountries: () => fetch("GET", "/countries"),
  };
};
