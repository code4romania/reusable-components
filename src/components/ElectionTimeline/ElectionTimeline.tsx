import { parseISO } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { ElectionBallotMeta } from "../../types/Election";
import { mergeClasses, themable } from "../../util/theme";
import cssClasses from "./ElectionTimeline.module.scss";

type Props = {
  items: ElectionBallotMeta[];
  selectedBallotId?: number | null;
  onSelectBallot?: (meta: ElectionBallotMeta) => unknown;
};

const dateComparator = (a: ElectionBallotMeta, b: ElectionBallotMeta): number => {
  return parseISO(b.date).getTime() - parseISO(a.date).getTime();
};

type TimelineElection = {
  electionId: number;
  title: string;
  live: boolean;
  ballots: ElectionBallotMeta[];
};
type TimelineYear = { year: number; elections: TimelineElection[] };

export const ElectionTimeline = themable<Props>(
  "ElectionTimeline",
  cssClasses,
)(({ classes, items, selectedBallotId, onSelectBallot }) => {
  const years = useMemo(() => {
    const sortedItems = [...items];
    sortedItems.sort(dateComparator);

    const yearsArray: TimelineYear[] = [];
    let lastYear: number;
    let electionsById: Map<number, TimelineElection>;

    sortedItems.forEach((meta: ElectionBallotMeta) => {
      const metaYear = parseISO(meta.date).getFullYear();
      if (metaYear !== lastYear) {
        lastYear = metaYear;
        electionsById = new Map();
        yearsArray.push({ year: metaYear, elections: [] });
      }
      const currentYear = yearsArray[yearsArray.length - 1];

      const { electionId } = meta;
      let election = electionsById.get(electionId);
      if (!election) {
        election = { electionId, title: meta.title, live: !!meta.live, ballots: [] };
        currentYear.elections.push(election);
        electionsById.set(electionId, election);
      }

      election.ballots.push(meta);
    });

    return yearsArray;
  }, [items]);

  const [selectedElectionId, selectedYear] = useMemo(() => {
    if (selectedBallotId == null) return [null, null];
    const meta = items.find((m) => m.ballotId === selectedBallotId);
    if (!meta) return [null, null];
    return [meta.electionId, parseISO(meta.date).getFullYear()];
  }, [items, selectedBallotId]);

  const [expandedElections, setExpandedElections] = useState<Set<number>>(() => new Set());
  useEffect(() => {
    setExpandedElections((set) => {
      if (selectedElectionId == null || set.has(selectedElectionId)) return set;
      const newSet = new Set(set);
      newSet.add(selectedElectionId);
      return newSet;
    });
  }, [selectedElectionId]);

  const onElectionClick = (election: TimelineElection) => () => {
    if (election.ballots.length === 1) {
      if (onSelectBallot) {
        onSelectBallot(election.ballots[0]);
      }
      return;
    }

    const { electionId } = election;
    setExpandedElections((set) => {
      const newSet = new Set(set);
      if (set.has(electionId)) {
        newSet.delete(electionId);
      } else {
        newSet.add(electionId);
      }
      return newSet;
    });
  };

  const onBallotClick = (meta: ElectionBallotMeta) => () => {
    if (onSelectBallot) {
      onSelectBallot(meta);
    }
  };

  return (
    <div className={classes.root}>
      {years.map((year) => (
        <div key={year.year} className={classes.year}>
          <div className={mergeClasses(classes.yearRow, selectedYear === year.year && classes.selectedYear)}>
            {year.year}
          </div>
          {year.elections.map((election) => (
            <div key={election.electionId} className={classes.election}>
              <div className={classes.electionRow} onClick={onElectionClick(election)}>
                <div className={classes.collapseWidget}>
                  {election.ballots.length > 1 && (
                    <svg
                      className={mergeClasses(
                        classes.collapseCaret,
                        expandedElections.has(election.electionId) && classes.collapseCaretExpanded,
                      )}
                      viewBox="0 0 7 10"
                    >
                      <path d="M 0 0 L 0 10 L 7 5 L 0 0" fill="currentColor" />
                    </svg>
                  )}
                </div>
                <div
                  className={mergeClasses(
                    classes.electionTitle,
                    selectedElectionId === election.electionId && classes.selectedElection,
                  )}
                >
                  {election.title}
                </div>
                {election.live && <div className={classes.live}>LIVE</div>}
              </div>
              {expandedElections.has(election.electionId) &&
                election.ballots.length >= 2 &&
                election.ballots.map((meta, index) => (
                  <div key={meta.ballotId} className={classes.ballotRow} onClick={onBallotClick(meta)}>
                    <div
                      className={mergeClasses(
                        classes.ballotTitle,
                        selectedBallotId === meta.ballotId && classes.selectedBallot,
                      )}
                    >
                      {meta.ballot || `${meta.title} ${index + 1}`}
                    </div>
                  </div>
                ))}
            </div>
          ))}
          <div className={classes.yearLine} />
          <div className={mergeClasses(classes.yearDot, selectedYear === year.year && classes.selectedYearDot)} />
        </div>
      ))}
    </div>
  );
});
