import { Election, ElectionScope } from "../types/Election";
import { APIInvocation, JSONFetch, makeJsonFetch } from "./api";

const productionApiUrl = "https://example.com"; // TODO

export interface ElectionAPI {
  getElection: (id: string, scope: ElectionScope) => APIInvocation<Election>;
}

export const makeElectionApi = (options?: {
  apiUrl?: string;
  fetch?: JSONFetch; // for optional mocking
}): ElectionAPI => {
  const fetch = options?.fetch ?? makeJsonFetch(options?.apiUrl ?? productionApiUrl);
  return {
    getElection: (id, scope) => fetch("GET", `/elections/${id}`, { query: scope }),
  };
};
