import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as d3Select from "d3-selection";
import * as d3Scale from "d3-scale";
import "./PercentageAsBar.scss";

const PercentageAsBar = ({ value, totalColor, turnoutColor }) => {
  useEffect(() => {
    drawBars();
  }, [value]);

  const chartWidth = 1000;
  const chartHeight = 110;
  const barHeight = 60;
  const overlap = 20;
  const textMargin = 10;
  const barY = barHeight - overlap;

  const drawBars = () => {
    d3Select.select(".percentage-as-bar svg").remove();

    const svg = d3Select
      .select(".percentage-as-bar")
      .append("svg")
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const xScale = d3Scale
      .scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth]);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", barHeight)
      .attr("width", chartWidth)
      .style("fill", totalColor);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", barY)
      .attr("height", barHeight)
      .attr("width", xScale(value))
      .style("fill", turnoutColor);

    svg
      .append("text")
      .attr("class", "text-value")
      .attr("text-anchor", "end")
      .attr("x", chartWidth - textMargin)
      .attr("y", barHeight / 2 + textMargin)
      .text("100%");

    svg
      .append("text")
      .attr("class", "text-value")
      .attr("text-anchor", "end")
      .attr("x", xScale(value) - textMargin)
      .attr("y", barHeight / 2 + textMargin + barY)
      .text(`${value}%`);
  };

  return <div className={"percentage-as-bar"} />;
};

export default PercentageAsBar;

PercentageAsBar.propTypes = {
  value: PropTypes.number.isRequired,
  totalColor: PropTypes.string,
  turnoutColor: PropTypes.string,
};
