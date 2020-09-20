import React, { ComponentType, ReactNode } from "react";
import { themable, ThemableComponentProps } from "../../util/theme";

type Props = {
  width: number;
  height: number;
  yGridSteps: number;
  yMax: number;
  fontSize: number;
  maxBarWidth: number;
  maxBarSpacing: number;
  minBarWidth: number;
  minBarSpacing: number;
  leftBarMargin: number;
  rightBarMargin: number;
  bars: {
    color: string;
    value: number;
  }[];
  renderLabel: (y: number) => ReactNode;
};

const defaultConstants = {
  gridLabelColor: "#C1C1C1",
  gridColor: "#E2E2E2",
};

export const BarChart = themable<Props>(
  "BarChart",
  undefined,
  defaultConstants,
)(
  ({
    classes,
    constants,
    width,
    height,
    yGridSteps,
    yMax,
    fontSize,
    renderLabel,
    maxBarSpacing,
    minBarSpacing,
    maxBarWidth,
    minBarWidth,
    leftBarMargin,
    rightBarMargin,
    bars,
  }) => {
    const yScale = (height - fontSize - 2) / yMax;

    const lines = [];
    const labels = [];
    for (let i = 0; i <= yGridSteps; i++) {
      const value = i * (yMax / yGridSteps);
      const y = Math.round(height - yScale * value);
      const lineY = y - 0.5; // to account for line width and prevent aliasing;
      lines.push(<line key={i} stroke={constants.gridColor} x1={0} x2={width} y1={lineY} y2={lineY} />);
      labels.push(
        <text
          key={i}
          textAnchor="end"
          x={width}
          y={y - 2}
          className={classes.yGridLabel}
          fill={constants.gridLabelColor}
          style={{ fontSize }}
        >
          {renderLabel(value)}
        </text>,
      );
    }

    const usableBarWidth = width - leftBarMargin - rightBarMargin;
    const spacingRatio = maxBarSpacing / (maxBarSpacing + maxBarWidth);
    const desiredStride = usableBarWidth / (bars.length + spacingRatio);
    const barSpacing = Math.max(minBarSpacing, Math.min(maxBarSpacing, desiredStride * spacingRatio));
    const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, desiredStride - barSpacing));
    const stride = barSpacing + barWidth;

    const barRects = bars.map(({ value, color }, index) => (
      <rect
        key={index}
        x={index * stride + barSpacing}
        y={height - yScale * value}
        width={barWidth}
        height={yScale * value}
        fill={color}
      />
    ));

    return (
      <svg className={classes.root} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {lines}
        {labels}
        {barRects}
      </svg>
    );
  },
) as ComponentType<Partial<ThemableComponentProps<Props>>>; // To make defaultProps work

BarChart.defaultProps = {
  width: 220,
  height: 100,
  yGridSteps: 4,
  yMax: 1.0,
  fontSize: 10,
  minBarSpacing: 1,
  minBarWidth: 1,
  maxBarSpacing: 24,
  maxBarWidth: 48,
  leftBarMargin: 0,
  rightBarMargin: 40,
  renderLabel: (x) => x,
  bars: [],
};
