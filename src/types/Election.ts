export const DIASPORA = "DI";

export type ElectionScope =
  | {
      type: "national";
    }
  | {
      type: "county";
      county: string; // 2-letter county codes? "DI" for diaspora
    }
  | {
      type: "city";
      county: string; // 2-letter county codes?
      city: string; // Do we have IDs for each town? In case of diaspora, they can be countries.
    }
  | {
      type: "uat";
      county: string; // 2-letter county codes?
      city: string; // Do we have IDs for each town?
      uat: string; // I remember UATs had IDs
    };

export type ElectionMeta = {
  // The app should work with any specified "type" in here, including values unknown yet to the frontend
  // This is just for extra visual customisation like splitting local council results in two tables,
  // showing the parliament seats widget or showing disapora next to the map or not
  type: "referendum" | "president" | "senate" | "house" | "local_council" | "county_council" | "mayor" | string;
  date: string; // ISO 8601
  title: string; // eg. "Alegeri locale"
  ballot?: string; // eg. "Primar", maybe find a better name for this?
  subtitle?: string; // eg. "Pentru trecerea la parlament unicameral și reducerea numărului de parlamentari"
};

// You get one of these after making a request with an ID and the data in an ElectionScope
// (url-encoded in the GET request or whatever)
export type Election = {
  id: string;
  scope: ElectionScope;
  meta: ElectionMeta;
  turnout: ElectionTurnout;
  observation?: ElectionObservation; // I guess send this only for the national scope
};

export type ElectionTurnout = {
  eligibleVoters?: number; // Cetățeni cu drept de vot. Nu se aplică pentru diaspora
  totalVotes: number;
  breakdown?: {
    type: "national" | "diaspora" | "all"; // Open to extensions. "all" means this chart applies to the whole scope
    total?: number;
    categories: {
      type: "permanent_lists" | "supplementary_lists" | "mobile_ballot_box" | "vote_by_post"; // Open to extensions
      votes: number;
    }[];
  }[];
};

export type ElectionObservation = {
  coveredPollingPlaces: number;
  coveredCounties: number;
  observerCount: number;
  messageCount: number;
  issueCount: number;
};

export type ElectionResults = {
  eligibleVoters?: number; // We are duplicating these two values from ElectionTurnout. Should we?
  totalVotes: number; // We are duplicating these two values from ElectionTurnout. Should we?
  validVotes: number;
  nullVotes: number;
  totalSeats?: number; // For the parliament (maybe even council) seats widget

  candidates: {
    // These still refer to parties in the context of local_council and county_council
    name: string; // eg. "Uniunea Salvați România",
    shortName?: string; // eg. "USR"
    partyColor?: string;
    partyLogo?: string; // A URL to a party logo image (square, with transparency, preferably SVG)
    votes: number;
    seats?: number;
    seatsGained?: number | "new";
    [extraFields: string]: number | string; // Care e faza cu "Mandat1/Mandat2"?
  }[]; // Sorted descending by votes

  // TODO. For local_council and county_council
  // Might even be good to separate this in a separate request, as the party lists might be long
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nominalCandidates?: any;

  // TODO: I haven't the slightest idea what should go in here, but I assume some sort
  // of an URL/category ID for the blog API
  newsfeed?: string;
};
