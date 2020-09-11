import React, { useState } from "react";
import classes from "./CountyLocalitySelect.module.scss";
import { Heading2, Label } from "../Typography/Typography";

type Props = {
  counties: {
    id: string;
    label: string;
    countyName: string;
  }[];
  localities: {
    id: string;
    label: string;
    localityName: string;
    countyName: string;
  }[];
};

export const CountyLocalitySelect: React.FC<Props> = ({ counties, localities }) => {
  const [state, setState] = useState({
    selectedLocality: undefined,
    selectedCounty: undefined,
    localities: localities,
  });

  const changeCounty = (evt) => {
    const value = evt.target.value;

    setState({
      ...state,
      selectedCounty: value,
      localities: value ? localities.filter((loc) => loc.countyName === value) : localities,
    });
  };

  const changeLocality = (evt) => {
    setState({
      ...state,
      selectedLocality: evt.target.value,
    });
  };

  return (
    <div className={classes.root}>
      <Heading2 className={classes.h2}>Localitate</Heading2>

      <div>
        <Label>Județ</Label>
        <select value={state.selectedCounty} onChange={changeCounty}>
          <option value="">Alege județul</option>
          {counties.map((county) => (
            <option key={county.label} value={county.label}>
              {county.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Localitate</Label>
        <select value={state.selectedLocality} onChange={changeLocality}>
          <option value="">Alege localitatea</option>
          {state.localities.map((loc) => (
            <option key={loc.localityName} value={loc.label}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
