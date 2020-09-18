import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import { ElectionScope, ElectionScopeIncomplete } from "../../types/Election";
import { APIRequestState, useApiResponse } from "../../util/api";
import { ElectionScopeAPI, OptionWithID } from "../../util/electionApi";
import { themable, useTheme } from "../../util/theme";
import { Label } from "../Typography/Typography";
import cssClasses from "./ElectionScopePicker.module.scss";

type Props = {
  apiData: ElectionScopePickerAPIData;
  value: ElectionScope;
  onChange: (scope: ElectionScope) => unknown;
};

export const electionScopePickerUpdateType = (
  scope: ElectionScopeIncomplete,
  type: ElectionScope["type"],
): ElectionScopeIncomplete => {
  if (scope.type === type || (type === "diaspora" && scope.type === "diaspora_country" && scope.countryId != null)) {
    return scope;
  }

  switch (type) {
    case "national":
      return { type: "national" };
    case "diaspora":
      return { type: "diaspora" };
    case "diaspora_country":
      return {
        type: "diaspora_country",
        countryId: (scope as any)?.countryId ?? null, // eslint-disable-line @typescript-eslint/no-explicit-any
      };
    case "county":
      return {
        type: "county",
        countyId: (scope as any)?.countyId ?? null, // eslint-disable-line @typescript-eslint/no-explicit-any
      };
    case "locality":
      return {
        type: "locality",
        countyId: (scope as any)?.countyId ?? null, // eslint-disable-line @typescript-eslint/no-explicit-any
        localityId: (scope as any)?.localityId ?? null, // eslint-disable-line @typescript-eslint/no-explicit-any
      };
  }
};

export type ElectionScopePickerAPIData = {
  countyData: APIRequestState<OptionWithID[]>;
  localityData: APIRequestState<OptionWithID[]>;
  countryData: APIRequestState<OptionWithID[]>;
};

export const useElectionScopePickerApi = (
  api: ElectionScopeAPI,
  scope: ElectionScopeIncomplete,
): ElectionScopePickerAPIData => {
  const shouldQueryCounty = scope.type === "county" || scope.type === "locality";
  const countyData = useApiResponse(() => (shouldQueryCounty ? api.getCounties() : null), [api, shouldQueryCounty]);

  const queryCountyId: number | null = (scope.type === "locality" ? scope.countyId : null) ?? null;
  const localityData = useApiResponse(
    () =>
      queryCountyId != null
        ? {
            invocation: api.getLocalities(queryCountyId),
            discardPreviousData: true,
          }
        : null,
    [api, queryCountyId],
  );

  const shouldQueryCountry = scope.type === "diaspora" || scope.type === "diaspora_country";
  const countryData = useApiResponse(() => (shouldQueryCountry ? api.getCountries() : null), [api, shouldQueryCountry]);

  return { countyData, localityData, countryData };
};

export type ElectionScopePickerSelectProps<K = number> = {
  label: string;
  selectProps: {
    value: OptionWithID<K> | null;
    onChange: (value: OptionWithID<K> | null) => unknown;
    options: OptionWithID<K>[];
    isLoading: boolean;
    isDisabled: boolean;
    placeholder?: string;
  };
};

function resolveValue<K extends string | number>(x: K | OptionWithID<K> | null): K | null {
  return typeof x === "object" ? x?.id : x;
}

const resolveInMap = (id, map) => (id == null ? null : { id, name: map.get(id)?.name });
const buildMap = (list) => {
  const map = new Map();
  if (list) {
    list.forEach((item) => {
      map.set(item.id, item);
    });
  }
  return map;
};

export const useElectionScopePickerGetSelectProps = (
  apiData: ElectionScopePickerAPIData,
  scope: ElectionScopeIncomplete,
  onChangeScope: (newScope: ElectionScopeIncomplete) => unknown,
): ElectionScopePickerSelectProps[] => {
  const countyMap = useMemo(() => buildMap(apiData.countyData.data), [apiData.countyData.data]);
  const localityMap = useMemo(() => buildMap(apiData.localityData.data), [apiData.localityData.data]);
  const countryMap = useMemo(() => buildMap(apiData.countyData.data), [apiData.countryData.data]);

  const onCountyChange = useCallback(
    (value: number | OptionWithID<number> | null) => {
      const countyId = resolveValue(value);
      if (scope.type === "county" && countyId !== (scope.countyId ?? null)) {
        onChangeScope({ type: "county", countyId });
      } else if (scope.type === "locality" && countyId !== (scope.countyId ?? null)) {
        onChangeScope({ type: "locality", countyId, localityId: null });
      }
    },
    [scope, onChangeScope],
  );

  const onLocalityChange = useCallback(
    (value: number | OptionWithID<number> | null) => {
      const localityId = resolveValue(value);
      if (scope.type === "locality" && localityId !== (scope.localityId ?? null)) {
        onChangeScope({ type: "locality", countyId: scope.countyId, localityId });
      }
    },
    [scope, onChangeScope],
  );

  const onCountryChange = useCallback(
    (value: number | OptionWithID<number> | null) => {
      const countryId = resolveValue(value);
      if (countryId == null) {
        if (scope.type === "diaspora_country") {
          onChangeScope({ type: "diaspora" });
        }
      } else {
        if (
          scope.type === "diaspora" ||
          (scope.type === "diaspora_country" && countryId !== (scope.countryId ?? null))
        ) {
          onChangeScope({ type: "diaspora_country", countryId });
        }
      }
    },
    [scope, onChangeScope],
  );

  const selects: ElectionScopePickerSelectProps[] = [];

  if (scope.type === "county" || scope.type === "locality") {
    selects.push({
      label: "Județ",
      selectProps: {
        value: resolveInMap(scope.countyId, countyMap),
        onChange: onCountyChange,
        options: apiData.countyData.data ?? [],
        isLoading: apiData.countyData.loading,
        isDisabled: false,
        placeholder: "Selectează un județ",
      },
    });
  }

  if (scope.type === "locality") {
    selects.push({
      label: "Localitate",
      selectProps: {
        value: resolveInMap(scope.localityId, localityMap),
        onChange: onLocalityChange,
        options: apiData.localityData.data ?? [],
        isLoading: apiData.localityData.loading,
        isDisabled: scope.countyId == null,
        placeholder: "Selectează o localitate",
      },
    });
  }

  if (scope.type === "diaspora" || scope.type === "diaspora_country") {
    selects.push({
      label: "Țară",
      selectProps: {
        value: resolveInMap(scope.type === "diaspora_country" ? scope.countryId : null, countryMap),
        onChange: onCountryChange,
        options: apiData.countryData.data ?? [],
        isLoading: apiData.countryData.loading,
        isDisabled: false,
        placeholder: "Selectează o țară",
      },
    });
  }

  return selects;
};

function getOptionLabel<K>({ name }: OptionWithID<K, string>): string {
  return name;
}
function getOptionValue<K>({ id }: OptionWithID<K>): string {
  return id.toString();
}

const typeNames = {
  national: "Național",
  county: "Județ",
  locality: "Localitate",
  diaspora: "Diaspora",
};

const typeOptions: OptionWithID<ElectionScope["type"]>[] = [
  { id: "national", name: typeNames.national },
  { id: "county", name: typeNames.county },
  { id: "locality", name: typeNames.locality },
  { id: "diaspora", name: typeNames.diaspora },
];

export const useElectionScopePickerGetTypeSelectProps = (
  scope: ElectionScopeIncomplete,
  onChangeScope: (newScope: ElectionScopeIncomplete) => unknown,
): ElectionScopePickerSelectProps<ElectionScope["type"]> => {
  const onTypeChange = useCallback(
    (value: ElectionScope["type"] | OptionWithID<ElectionScope["type"]> | null) => {
      const type = resolveValue(value);
      const newScope = electionScopePickerUpdateType(scope, type);
      if (newScope !== scope) {
        onChangeScope(newScope);
      }
    },
    [scope, onChangeScope],
  );

  const value = scope.type === "diaspora_country" ? "diaspora" : scope.type;
  return {
    label: "Diviziune",
    selectProps: {
      value: { id: value, name: typeNames[value] },
      onChange: onTypeChange,
      options: typeOptions,
      isLoading: false,
      isDisabled: false,
    },
  };
};

const loadingMessage = () => "Se încarcă...";

const typeSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
  }),
  valueContainer: (provided) => ({
    ...provided,
    fontWeight: 600,
    fontSize: `${30 / 16}rem`,
    paddingLeft: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export const ElectionScopePicker = themable<Props>(
  "ElectionScopePicker",
  cssClasses,
)(({ classes, apiData, value, onChange }) => {
  const typeSelect = useElectionScopePickerGetTypeSelectProps(value, onChange);
  const selects = useElectionScopePickerGetSelectProps(apiData, value, onChange);
  const theme = useTheme();

  const selectTheme = useMemo(
    () => (t) => ({
      ...t,
      colors: {
        ...t.colors,
        primary: theme.colors.primary,
        primary75: theme.colors.primary75,
        primary50: theme.colors.primary50,
        primary25: theme.colors.primary25,
      },
    }),
    [theme],
  );

  return (
    <div className={classes.root}>
      <Select
        {...typeSelect.selectProps}
        isSearchable={false}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        theme={selectTheme}
        className={classes.typeSelect}
        styles={typeSelectStyles}
      />
      <div className={classes.selects}>
        {selects.map(({ label, selectProps }, index) => (
          <div key={index} className={classes.selectContainer}>
            <Label className={classes.selectLabel}>{label}</Label>
            <Select
              {...selectProps}
              isClearable
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              theme={selectTheme}
              className={classes.select}
              loadingMessage={loadingMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
