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
    complete: !missingCounty && !missingLocality && !missingCountry ? (scope as unknown as ElectionScope) : null,
    missingCounty,
    missingLocality,
    missingCountry,
  };
};

export const bucharestCountyId = 12913;

// Weird API quirk. Seats arrive as votes in results.
// This should be set to false or completely removed after the API is fixed.
export const electionResultsInterpretVotesAsSeats = (
  scope: ElectionScopeIncomplete,
  electionType: ElectionType,
): boolean =>
  (scope.type === "national" && electionType === "mayor") ||
  (scope.type === "county" && electionType === "mayor" && scope.countyId !== bucharestCountyId) ||
  (scope.type === "national" && electionType === "county_council_president");

// Only coincidentally same as above
export const electionResultsDisplayVotes = (scope: ElectionScopeIncomplete, electionType: ElectionType): boolean =>
  !(
    (scope.type === "national" && electionType === "mayor") ||
    (scope.type === "county" && electionType === "mayor" && scope.countyId !== bucharestCountyId) ||
    (scope.type === "national" && electionType === "county_council_president")
  );

export const electionResultsSeatsIsMainStat = (scope: ElectionScopeIncomplete, electionType: ElectionType): boolean =>
  !electionResultsDisplayVotes(scope, electionType) ||
  (scope.type === "national" && electionType === "county_council") ||
  ((scope.type === "national" || scope.type === "county") && electionType === "local_council");

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
  | "county_council_president"
  | "mayor"
  | "european_parliament"
  | string;

export type ElectionStage = "prov" | "part" | "final" | string;

export const electionTypeInvolvesDiaspora = (electionType: ElectionType): boolean =>
  electionTypeCompatibleScopes(electionType).diaspora !== false;

export const electionTypeHasSeats = (electionType: ElectionType): boolean =>
  electionType === "senate" ||
  electionType === "house" ||
  electionType === "local_council" ||
  electionType === "county_council" ||
  electionType === "european_parliament";

export const electionTypeHasNationalResults = (electionType: ElectionType): boolean =>
  electionType === "referendum" ||
  electionType === "president" ||
  electionType === "senate" ||
  electionType === "house" ||
  electionType === "european_parliament";

export const electionHasSeats = (electionType: ElectionType, results: ElectionResults): boolean =>
  electionTypeHasSeats(electionType) &&
  results.candidates.reduce<boolean>((acc, cand) => acc || cand.seats != null, false);

export type ElectionCompatibleScopes = Partial<Record<ElectionScope["type"], boolean>>;

const allCompatibleScopes: ElectionCompatibleScopes = {};
const countyCompatibleScopes: ElectionCompatibleScopes = { locality: false, diaspora: false, diaspora_country: false };
const localCompatibleScopes: ElectionCompatibleScopes = { diaspora: false, diaspora_country: false };

const compatibleScopesByType: Partial<Record<ElectionType, ElectionCompatibleScopes>> = {
  local_council: localCompatibleScopes,
  mayor: localCompatibleScopes,
  county_council: countyCompatibleScopes,
  county_council_president: countyCompatibleScopes,
};

export const electionTypeCompatibleScopes = (electionType: ElectionType): ElectionCompatibleScopes =>
  compatibleScopesByType[electionType] ?? allCompatibleScopes;

const fallbackOrder: ElectionScope["type"][] = ["national", "diaspora", "county", "locality", "diaspora_country"];
const emptyScopes: Record<ElectionScope["type"], ElectionScopeIncomplete> = {
  national: { type: "national" },
  county: { type: "county", countyId: null },
  locality: { type: "locality", countyId: null, localityId: null },
  diaspora: { type: "diaspora" },
  diaspora_country: { type: "diaspora_country", countryId: null },
};

export const electionScopeCoerceToCompatible = (
  scope: ElectionScopeIncomplete,
  compatibleScopes: ElectionCompatibleScopes,
): ElectionScopeIncomplete => {
  if (compatibleScopes[scope.type] !== false) return scope;

  if (scope.type === "locality") {
    return electionScopeCoerceToCompatible({ type: "county", countyId: scope.countyId }, compatibleScopes);
  }

  if (scope.type === "diaspora_country") {
    return electionScopeCoerceToCompatible({ type: "diaspora" }, compatibleScopes);
  }

  for (const fallbackType of fallbackOrder) {
    if (compatibleScopes[fallbackType] !== false) {
      return emptyScopes[fallbackType];
    }
  }

  return emptyScopes.national;
};

export type ElectionBallotMeta = {
  // The app should work with any specified "type" in here, including values unknown yet to the frontend
  // This is just for extra visual customisation like splitting local council results in two tables,
  // showing the parliament seats widget or showing disapora next to the map or not
  type: ElectionType;
  date: string; // ISO 8601
  title: string; // eg. "Alegeri locale"
  ballot?: string | null; // eg. "Primar", maybe find a better name for this?
  subtitle?: string | null; // eg. "Pentru trecerea la parlament unicameral și reducerea numărului de parlamentari"
  live?: boolean | null; // Send true when the election is ongoing
  stage?: ElectionStage;

  ballotId: number; // The ID of this Election (Ballot in the backend, a rename might be in order)
  electionId: number; // Used for grouping
};

// You get one of these after making a request with an ID and the data in an ElectionScope
// (url-encoded in the GET request or whatever)
export type ElectionBallot = {
  scope: ElectionScopeResolved;
  meta: ElectionBallotMeta;

  // These can be missing if the election doesn't support the current scope (eg. local elections with a national scope).
  turnout?: ElectionTurnout | null;
  results?: ElectionResults | null;

  // Send this only when it makes sense (for the national scope)
  observation?: ElectionObservation | null;

  electionNews?: ElectionNewsFeed | null;
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

export type ElectionResultsPartyCandidate = {
  name: string;
};

export type ElectionResultsPartyCandidates = {
  name: string;
  candidates: ElectionResultsPartyCandidate[];
};

export type ElectionResults = {
  eligibleVoters?: number | null; // Duplicate this from ElectionTurnout
  totalVotes: number; // Duplicate this from ElectionTurnout
  countedVotes?: number | null;
  votesByMail?: number | null; // For diaspora
  validVotes: number;
  nullVotes: number;
  totalSeats?: number | null; // For the parliament (maybe even council) seats widget
  candidates: ElectionResultsCandidate[]; // Sorted descending by votes
};

export type ElectionNews = {
  id: number; // This is important to prevent re-renders on auto-updates
  timestamp: string; // ISO 8601
  author: {
    name: string;
    avatar?: string | null; // URL to image. I'll replace this with a blank avatar if it's missing
  };
  title?: string | null;
  body: string;

  // Directly URLs, or an object with thumbnails and full resolution images separated
  pictures?: (string | { thumbnail?: string | null; image?: string | null })[] | null;
  images?: {
    id: number;
    url: string;
    articleId: number;
  }[];

  embed?: string | null; // Arbitrary HTML, since that's what most publish tools export
  link?: string | null; // Link to the original story
};

export type ElectionNewsFeed = ElectionNews[];

export type ElectionMapScope = { type: "national" } | { type: "county"; countyId: number } | { type: "diaspora" };

export type ElectionMapWinner = {
  id: number; // The ID of the map feature (countyId / countryId / localityId)
  validVotes?: number; // Needed to calculate percentages in map tooltips
  winner: {
    name: string; // eg. "Uniunea Salvați România",
    shortName?: string | null; // eg. "USR"
    partyColor?: string | null;
    votes?: number;
    seats?: number;
  };
};

export type ElectionMapWinners = ElectionMapWinner[];
