type ElectionScope_<T> =
  | { type: "national" }
  | { type: "county"; countyId: T }
  | { type: "locality"; countyId: T; localityId: T }
  | { type: "diaspora" }
  | { type: "diaspora_country"; countryId: T };

export type ElectionScope = ElectionScope_<number>;
export type ElectionScopeIncomplete = ElectionScope_<number | null>;

export type ElectionScopeCompleteness = {
  complete: ElectionScope | null;
  missingCounty: boolean;
  missingLocality: boolean;
  missingCountry: boolean;
};

export const electionScopeIsComplete = (scope: ElectionScopeIncomplete): ElectionScopeCompleteness => {
  const missingCounty = (scope.type === "county" || scope.type === "locality") && scope.countyId == null;
  const missingLocality = scope.type === "locality" && scope.localityId == null;
  const missingCountry = scope.type === "diaspora_country" && scope.countryId == null;
  return {
    complete: !missingCounty && !missingLocality && !missingCountry ? ((scope as unknown) as ElectionScope) : null,
    missingCounty,
    missingLocality,
    missingCountry,
  };
};

export type ElectionScopeNames = {
  countyName?: string | null;
  countryName?: string | null;
  localityName?: string | null;
};
export type ElectionScopeResolved = ElectionScope & ElectionScopeNames;
export type ElectionScopeIncompleteResolved = ElectionScopeIncomplete & ElectionScopeNames;

export type ElectionType =
  | "referendum"
  | "president"
  | "senate"
  | "house"
  | "local_council"
  | "county_council"
  | "mayor"
  | "european_parliament"
  | string;

export const electionTypeInvolvesDiaspora = (electionType: ElectionType): boolean =>
  electionType !== "local_council" && electionType !== "county_council" && electionType !== "mayor";

export const electionTypeHasSeats = (electionType: ElectionType): boolean =>
  electionType === "senate" ||
  electionType === "house" ||
  electionType === "local_council" ||
  electionType === "county_council" ||
  electionType === "european_parliament";

export const electionHasSeats = (electionType: ElectionType, results: ElectionResults): boolean =>
  electionTypeHasSeats(electionType) &&
  results.candidates.reduce<boolean>((acc, cand) => acc || cand.seats != null, false);

export type ElectionMeta = {
  // The app should work with any specified "type" in here, including values unknown yet to the frontend
  // This is just for extra visual customisation like splitting local council results in two tables,
  // showing the parliament seats widget or showing disapora next to the map or not
  type: ElectionType;
  date: string; // ISO 8601
  title: string; // eg. "Alegeri locale"
  ballot?: string | null; // eg. "Primar", maybe find a better name for this?
  subtitle?: string | null; // eg. "Pentru trecerea la parlament unicameral și reducerea numărului de parlamentari"
  live?: boolean | null; // Send true when the election is ongoing

  ballotId: number; // The ID of this Election (Ballot in the backend, a rename might be in order)
  electionId: number; // Used for grouping

  // TODO: I haven't the slightest idea what should go in here, but I assume some sort
  // of an URL/category ID for the blog API
  newsfeed?: string;
};

// You get one of these after making a request with an ID and the data in an ElectionScope
// (url-encoded in the GET request or whatever)
export type Election = {
  scope: ElectionScopeResolved;
  meta: ElectionMeta;

  // These can be missing if the election doesn't support the current scope (eg. local elections with a national scope).
  turnout?: ElectionTurnout | null;
  results?: ElectionResults | null;

  // Send this only when it makes sense (for the national scope)
  observation?: ElectionObservation | null;
};

export type ElectionTurnout = {
  eligibleVoters?: number | null; // Cetățeni cu drept de vot. Nu se aplică pentru diaspora
  totalVotes: number;
  breakdown?: ElectionTurnoutBreakdown[] | null;
};

// Open to extensions
export type ElectionTurnoutBreakdownCategoryType =
  | "permanent_lists"
  | "supplementary_lists"
  | "mobile_ballot_box"
  | "vote_by_mail";

export type ElectionTurnoutBreakdown = {
  type: "national" | "diaspora" | "all"; // Open to extensions. "all" means this chart applies to the whole scope
  total?: number | null;
  categories: {
    type: ElectionTurnoutBreakdownCategoryType;
    votes: number;
  }[];
};

export type ElectionObservation = {
  coveredPollingPlaces: number;
  coveredCounties: number;
  observerCount: number;
  messageCount: number;
  issueCount: number;
};

export type ElectionResultsCandidate = {
  // These still refer to parties in the context of local_council and county_council
  name: string; // eg. "Uniunea Salvați România",
  shortName?: string | null; // eg. "USR"
  partyColor?: string | null;
  partyLogo?: string | null; // A URL to a party logo image (square, with transparency, preferably SVG)
  votes: number;
  seats?: number | null;
  seatsGained?: number | "new" | null;
  candidateCount?: number;
};

export type ElectionResults = {
  eligibleVoters?: number | null; // Duplicate this from ElectionTurnout
  totalVotes: number; // Duplicate this from ElectionTurnout
  votesByMail?: number | null; // For diaspora
  validVotes: number;
  nullVotes: number;
  totalSeats?: number | null; // For the parliament (maybe even council) seats widget
  candidates: ElectionResultsCandidate[]; // Sorted descending by votes
};
