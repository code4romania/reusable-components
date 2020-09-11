import React, { useState } from "react";
import Select from "react-select";

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

  const changeCounty = (county) => {
    const value = county.value;

    setState({
      ...state,
      selectedCounty: value,
      localities: value ? localities.filter((loc) => loc.countyName === value) : localities,
    });
  };

  const changeLocality = (locality) => {
    const value = locality.value;

    setState({
      ...state,
      selectedLocality: value,
    });
  };

  const countyList = counties.map((county) => ({ value: county.countyName, label: county.label }));
  const selectedCounty = countyList.find((county) => county.value === state.selectedCounty);

  const localityList = state.localities.map((locality) => ({ value: locality.localityName, label: locality.label }));
  const selectedLocality = localityList.find((locality) => locality.value === state.selectedLocality);

  console.log("state.county", state.selectedCounty);
  console.log("state.locality", state.selectedLocality);

  return (
    <div className={classes.root}>
      <Heading2 className={classes.h2}>Localitate</Heading2>

      {/* TO DO: make it so that users can undo selection */}
      <div>
        <Label className={classes.label}>Județ</Label>
        <Select placeholder="Alege județul" options={countyList} onChange={changeCounty} value={selectedCounty} />
      </div>

      {/* TO DO: make it so that users can undo selection */}
      <div>
        <Label className={classes.label}>Localitate</Label>
        <Select
          placeholder="Alege localitatea"
          options={localityList}
          onChange={changeLocality}
          value={selectedLocality}
        />
      </div>
    </div>
  );
};
