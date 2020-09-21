/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { PercentageBarsLegend } from "./PercentageBarsLegend";
import { PercentageBars } from "../PercentageBars/PercentageBars";

export default {
  title: "Percentage bars legend",
  component: PercentageBarsLegend,

  args: {
    value1: 100,
    label1: "100%",
    color1: "#FFCC00",
    name1: "Cetățeni cu drept de vot",
    note1: "(200.000)",
    value2: 50,
    label2: "50%",
    color2: "#352245",
    name2: "Au votat",
    note2: "(100.000)",
  },

  argTypes: {
    value1: { control: "number" },
    label1: { control: "text" },
    color1: { control: "color" },
    name1: { control: "text" },
    note1: { control: "text" },
    value2: { control: "number" },
    label2: { control: "text" },
    color2: { control: "color" },
    name2: { control: "text" },
    note2: { control: "text" },
  },
};

export const SimpleExample = ({ label1, color1, name1, note1, label2, color2, name2, note2 }: any) => {
  return (
    <PercentageBarsLegend
      items={[
        {
          legendColor: color1,
          legendName: name1,
          legendValueLabel: label1,
          legendNote: note1,
        },
        {
          legendColor: color2,
          legendName: name2,
          legendValueLabel: label2,
          legendNote: note2,
        },
      ]}
    />
  );
};

export const BarsWithLegend = ({
  total,
  value1,
  label1,
  color1,
  name1,
  note1,
  value2,
  label2,
  color2,
  name2,
  note2,
}: any) => {
  const items = [
    {
      color: color1,
      legendName: name1,
      valueLabel: label1,
      value: value1,
      legendNote: note1,
    },
    {
      color: color2,
      legendName: name2,
      valueLabel: label2,
      value: value2,
      legendNote: note2,
    },
  ];

  return (
    <>
      <PercentageBars total={total} items={items} />
      <PercentageBarsLegend items={items} />
    </>
  );
};

BarsWithLegend.args = { total: 100 };
BarsWithLegend.argTypes = { total: { control: "number" } };
