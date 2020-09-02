import type { ElectionMeta, ElectionTurnout } from "../types/Election";

export const mockPresidentialElectionMeta: ElectionMeta = {
  type: "president",
  date: "2019-11-24",
  title: "Alegeri prezidențiale",
  ballot: "Turul 2",
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
