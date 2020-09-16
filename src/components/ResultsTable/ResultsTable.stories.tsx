/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import { ResultsTable } from "./ResultsTable";

export default {
  title: "Results table",
  component: ResultsTable,
};

export const SimpleExample = () => (
  <ResultsTable>
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
        <th>Column 4</th>
      </tr>
    </thead>
    <tbody>
      {new Array(6).fill(0).map((_, index) => (
        <tr key={index}>
          <td>Row {index} column 1</td>
          <td>Row {index} column 2</td>
          <td>Row {index} column 3</td>
          <td>Row {index} column 4</td>
        </tr>
      ))}
    </tbody>
  </ResultsTable>
);
