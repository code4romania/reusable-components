import { ElectionMeta, ElectionScope, ElectionTurnout } from "../types/Election";

export const mockNationalElectionScope: ElectionScope = { type: "national" };
export const mockCountyElectionScope: ElectionScope = { type: "county", county: "PRAHOVA" };
export const mockCityElectionScope: ElectionScope = { type: "city", county: "PRAHOVA", city: "OLARII VECHI" };
export const mockElectionScope: ElectionScope = { type: "county", county: "PRAHOVA" };
export const mockDiasporaElectionScope: ElectionScope = { type: "diaspora" };
export const mockDiasporaCountryElectionScope: ElectionScope = { type: "diaspora_country", country: "POLONIA" };

export const mockPresidentialElectionMeta: ElectionMeta = {
  type: "president",
  date: "2019-11-24",
  title: "Alegeri prezidențiale",
  ballot: "Turul 2",
};

export const mockLocalCouncilElectionMeta: ElectionMeta = {
  type: "local_council",
  date: "2016-06-05",
  title: "Alegeri locale",
  ballot: "Consiliul Local",
};

export const mockPresidentialElectionTurnout: ElectionTurnout = {
  eligibleVoters: 18217411,
  totalVotes: 9086696,
  breakdown: [
    {
      type: "national",
      total: 18217411,
      categories: [
        {
          type: "permanent_lists",
          votes: 7839020,
        },
        {
          type: "supplementary_lists",
          votes: 1167827,
        },
        {
          type: "mobile_ballot_box",
          votes: 79849,
        },
      ],
    },
    {
      type: "diaspora",
      categories: [
        {
          type: "supplementary_lists",
          votes: 926574,
        },
        {
          type: "vote_by_post",
          votes: 17503,
        },
      ],
    },
  ],
};
