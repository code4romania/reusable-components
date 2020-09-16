import React, { memo, useMemo } from "react";
import { ElectionResults } from "../../types/Election";
import { electionCandidateColor, formatGroupedNumber } from "../../util/format";
import { mergeClasses, themable } from "../../util/theme";
import { ColoredSquare } from "../ColoredSquare/ColoredSquare";
import { DivBody, DivLabel } from "../Typography/Typography";
import useDimensions from "react-use-dimensions";
import cssClasses from "./ElectionResultsSeats.module.scss";

type Props = {
  results: ElectionResults;
};

const SeatsGraphic: React.FC<{ classes: IClassNames; results: ElectionResults; width: number; height: number }> = memo(
  function SeatsGraphicUnmemoized({ classes, results, width, height }) {
    const { totalSeats = 1 } = results;
    // Scale the dot size with the total number of dots so that
    // the total area of the graph remains the same.
    const r = useMemo(() => 45.345892868 / Math.sqrt(totalSeats), [totalSeats]);

    const dots = useMemo(() => {
      const spacing = 2.3;
      const dotsArray = [];

      // Determine how many dots fit in each row
      let R = 100 - r;
      let seatsLeft = totalSeats;
      const rows = [];
      while (seatsLeft > 0) {
        // Offset the first and last dot by a tiny angle so that they're tangent to the bottom of the viewport
        const offset = Math.asin(r / R);
        const seatsOnRow = 1 + Math.max(0, Math.floor(((Math.PI - offset * 2) * R) / (r * spacing)));
        seatsLeft -= seatsOnRow;
        rows.push({ R, offset, seatsOnRow });
        R -= r * spacing;
      }

      // We might have some empty slots left over that we need to
      // remove evenly from amongst the rows.
      if (seatsLeft < 0) {
        const div = Math.floor(-seatsLeft / rows.length);
        for (let i = 0; i < rows.length; i += 1) {
          rows[i].seatsOnRow -= div;
        }
        seatsLeft += div * rows.length;
      }

      // If they don't split evenly, remove the rest starting with the innermost row.
      if (seatsLeft < 0) {
        for (let i = rows.length - 1; i >= 0 && seatsLeft < 0; i -= 1) {
          rows[i].seatsOnRow -= 1;
          seatsLeft += 1;
        }
      }

      // Position each dot in polar coordinates
      for (let i = 0; i < rows.length; i++) {
        const { seatsOnRow, offset, R: rowR } = rows[i];
        const stride = (Math.PI - offset * 2) / (seatsOnRow - 1);
        for (let j = 0; j < seatsOnRow; j++) {
          dotsArray.push({ alpha: offset + j * stride, R: rowR, candidate: null });
        }
      }

      // Sort the dots radially left to right
      dotsArray.sort((a, b) => a.alpha - b.alpha);

      // Assign candidates to each dot
      let start = 0;
      let end = dotsArray.length - 1;
      let fromStart = false; // Alternate each candidate left/right
      results.candidates.forEach((candidate, index) => {
        let { seats } = candidate;
        if (Number.isFinite(seats) && seats > 0) {
          fromStart = !fromStart;
          for (; seats > 0 && start <= end; seats -= 1) {
            dotsArray[fromStart ? start : end].candidate = index;
            if (fromStart) {
              start += 1;
            } else {
              end -= 1;
            }
          }
        }
      });

      return dotsArray;
    }, [totalSeats, results]);

    return (
      <svg className={classes.svg} viewBox="0 0 200 100" width={width} height={height}>
        {dots.map((dot, index) => (
          <circle
            key={index}
            r={r}
            cx={100 - dot.R * Math.cos(dot.alpha)}
            cy={100 - dot.R * Math.sin(dot.alpha)}
            fill={dot.candidate != null ? electionCandidateColor(results.candidates[dot.candidate]) : "#ccc"}
          />
        ))}
      </svg>
    );
  },
);

const defaultThemeValues = {
  breakpoint: 560,
  height: 150,
};

export const ElectionResultsSeats = themable<Props>(
  "ElectionResultsSeats",
  cssClasses,
  defaultThemeValues,
)(({ classes, themeValues, results }) => {
  const [measureRef, { width }] = useDimensions();
  let svgHeight = themeValues.height;
  let svgWidth = themeValues.height * 2;
  if (svgWidth > width) {
    svgWidth = width;
    svgHeight = svgWidth * 0.5;
  }

  const vertical = width < themeValues.breakpoint;

  return (
    <div className={mergeClasses(classes.root, vertical && classes.vertical)} ref={measureRef}>
      <div className={classes.legend}>
        {results.candidates.map((candidate, index) =>
          Number.isFinite(candidate.seats) && candidate.seats > 0 ? (
            <DivBody className={classes.legendItem} key={index}>
              <ColoredSquare className={classes.square} color={electionCandidateColor(candidate)} />
              <div className={classes.legendLabel}>{candidate.shortName ?? candidate.name}</div>
              <DivLabel className={classes.legendValue}>&nbsp;({formatGroupedNumber(candidate.seats)})</DivLabel>
            </DivBody>
          ) : null,
        )}
      </div>
      <div className={classes.svgContainer}>
        <SeatsGraphic classes={classes} results={results} width={svgWidth} height={svgHeight} />
      </div>
    </div>
  );
});
