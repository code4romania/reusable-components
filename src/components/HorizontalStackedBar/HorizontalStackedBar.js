import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as d3Select from "d3-selection";
import * as d3Scale from "d3-scale";
import "./HorizontalStackedBar.scss";

const HorizontalStackedBar = ({ results }) => {
  useEffect(() => {
    drawBar();
  }, [results]);

  const marginBottom = 10;

  const chartWidth = 1000;
  const chartHeight = 80;
  const barHeight = chartHeight - 2 * marginBottom;
  const halfBarHeight = barHeight / 2;

  const putLabels = function (svg, leftLabel, rightLabel) {
    const textMargin = 5;
    const yBottomChart = chartHeight - marginBottom;

    svg
      .append("text")
      .attr("class", "text-value")
      .attr("x", textMargin)
      .attr("y", yBottomChart - textMargin)
      .text(leftLabel);

    svg
      .append("text")
      .attr("class", "text-value")
      .attr("text-anchor", "end")
      .attr("x", chartWidth - textMargin)
      .attr("y", yBottomChart - textMargin)
      .text(rightLabel);
  };

  const drawVerticalLine = function (svg, xCoord) {
    svg
      .append("line")
      .attr("x1", xCoord)
      .attr("x2", xCoord)
      .attr("y1", 0)
      .attr("y2", chartHeight)
      .style("stroke-width", 2)
      .style("stroke", "black");
  };

  const drawBar = () => {
    //this is to remove the previous svg (if exists) - useful in case of re-renders
    d3Select.select(".horizontal-stacked-bar svg").remove();

    const svg = d3Select
      .select(".horizontal-stacked-bar")
      .append("svg")
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const { stackedBarData, total } = stackResults(results);

    const xScale = d3Scale
      .scaleLinear()
      .domain([0, total])
      .range([0, chartWidth]);

    svg
      .selectAll("rect")
      .data(stackedBarData)
      .enter()
      .append("rect")
      .attr("class", "rect-stacked")
      .attr("x", (d) => xScale(d.cumulative))
      .attr("y", chartHeight / 2 - halfBarHeight)
      .attr("height", barHeight)
      .attr("width", (d) => xScale(d.value))
      .style("fill", (d) => d.data.color);

    drawVerticalLine(svg, xScale(total / 2));

    const len = stackedBarData.length;
    putLabels(svg, stackedBarData[0].value, stackedBarData[len - 1].value);
  };

  return <div className={"horizontal-stacked-bar"} />;
};

const stackResults = (results) => {
  return results.reduce(
    ({ stackedBarData, total }, result) => {
      stackedBarData.push({
        value: result.votes,
        cumulative: total,
        data: result,
      });
      return { stackedBarData: stackedBarData, total: total + result.votes };
    },
    { stackedBarData: [], total: 0 }
  );
};

export default HorizontalStackedBar;

HorizontalStackedBar.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      votes: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
};
