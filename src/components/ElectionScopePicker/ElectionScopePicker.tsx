import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import { ElectionCompatibleScopes, ElectionScope, ElectionScopeIncomplete } from "../../types/Election";
import { APIRequestState } from "../../util/api";
import { ElectionScopeAPI, OptionWithID } from "../../util/electionApi";
import { themable, useTheme } from "../../hooks/theme";
import { Label } from "../Typography/Typography";
import { useApiResponse } from "../../hooks/useApiResponse";
import cssClasses from "./ElectionScopePicker.module.scss";

type Props = {
  apiData: ElectionScopePickerAPIData;
  value: ElectionScopeIncomplete;
  onChange: (scope: ElectionScopeIncomplete) => unknown;
  compatibleScopes?: ElectionCompatibleScopes;
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
  ballotId?: number,
): ElectionScopePickerAPIData => {
  const shouldQueryCounty = scope.type === "county" || scope.type === "locality";
  const countyData = useApiResponse(
    () => (shouldQueryCounty ? api.getCounties(ballotId) : null),
    [api, shouldQueryCounty, ballotId],
  );

  const queryCountyId: number | null = (scope.type === "locality" ? scope.countyId : null) ?? null;
  const localityData = useApiResponse(
    () =>
      queryCountyId != null
        ? {
            invocation: api.getLocalities(queryCountyId, ballotId),
            discardPreviousData: true,
          }
        : null,
    [api, queryCountyId, ballotId],
  );

  const shouldQueryCountry = scope.type === "diaspora" || scope.type === "diaspora_country";
  const countryData = useApiResponse(
    () => (shouldQueryCountry ? api.getCountries(ballotId) : null),
    [api, shouldQueryCountry, ballotId],
  );

  return { countyData, localityData, countryData };
};

export type ElectionScopePickerSelectOnChange<K = number> = (
  value: OptionWithID<K> | ReadonlyArray<OptionWithID<K>> | null | undefined,
) => void;

export type ElectionScopePickerIsOptionDisabled<K = number> = (value: OptionWithID<K>) => boolean;

export type ElectionScopePickerSelectProps<K = number> = {
  label: string;
  selectProps: {
    value: OptionWithID<K> | null;
    onChange: ElectionScopePickerSelectOnChange<K>;
    options: OptionWithID<K>[];
    isOptionDisabled?: ElectionScopePickerIsOptionDisabled<K>;
    isLoading: boolean;
    isDisabled: boolean;
    placeholder?: string;
  };
};

function resolveValue<K extends string | number>(
  x: K | OptionWithID<K> | ReadonlyArray<OptionWithID<K>> | null | undefined,
): K | null {
  if (Array.isArray(x)) return x[0]?.id;
  return (typeof x === "object" ? (x as unknown as OptionWithID<K> | null)?.id : x) ?? null;
}

const resolveInMap = <K,>(id: K | null | undefined, map: Map<K, OptionWithID<K>>): OptionWithID<K> | null =>
  id == null ? null : { id, name: map.get(id)?.name || "" };

const buildMap = <K,>(list: OptionWithID<K>[] | null | undefined): Map<K, OptionWithID<K>> => {
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
  compatibleScopes?: ElectionCompatibleScopes,
): ElectionScopePickerSelectProps[] => {
  const countyMap = useMemo(() => buildMap(apiData.countyData.data), [apiData.countyData.data]);
  const localityMap = useMemo(() => buildMap(apiData.localityData.data), [apiData.localityData.data]);
  const countryMap = useMemo(() => buildMap(apiData.countryData.data), [apiData.countryData.data]);

  const onCountyChange = useCallback<ElectionScopePickerSelectOnChange>(
    (value) => {
      const countyId = resolveValue(value);
      if (scope.type === "county" && countyId !== (scope.countyId ?? null)) {
        onChangeScope({ type: "county", countyId });
      } else if (scope.type === "locality" && countyId !== (scope.countyId ?? null)) {
        onChangeScope({ type: "locality", countyId, localityId: null });
      }
    },
    [scope, onChangeScope],
  );

  const onLocalityChange = useCallback<ElectionScopePickerSelectOnChange>(
    (value) => {
      const localityId = resolveValue(value);
      if (scope.type === "locality" && localityId !== (scope.localityId ?? null)) {
        onChangeScope({ type: "locality", countyId: scope.countyId, localityId });
      }
    },
    [scope, onChangeScope],
  );

  const onCountryChange = useCallback<ElectionScopePickerSelectOnChange>(
    (value) => {
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

  if (
    (scope.type === "diaspora" && compatibleScopes?.diaspora_country !== false) ||
    scope.type === "diaspora_country"
  ) {
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
function getOptionValue<K extends string | number>({ id }: OptionWithID<K>): string {
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
  compatibleScopes?: ElectionCompatibleScopes,
): ElectionScopePickerSelectProps<ElectionScope["type"]> => {
  const onTypeChange = useCallback<ElectionScopePickerSelectOnChange<ElectionScope["type"]>>(
    (value) => {
      const type = resolveValue(value);
      if (type === null) return;
      const newScope = electionScopePickerUpdateType(scope, type);
      if (newScope !== scope) {
        onChangeScope(newScope);
      }
    },
    [scope, onChangeScope],
  );

  const isOptionDisabled = useMemo<ElectionScopePickerIsOptionDisabled<ElectionScope["type"]> | undefined>(
    () => (compatibleScopes ? (option) => compatibleScopes[option.id] === false : undefined),
    [compatibleScopes],
  );

  const value = scope.type === "diaspora_country" ? "diaspora" : scope.type;
  return {
    label: "Diviziune",
    selectProps: {
      value: { id: value, name: typeNames[value] },
      onChange: onTypeChange,
      options: typeOptions,
      isOptionDisabled,
      isLoading: false,
      isDisabled: false,
    },
  };
};

const loadingMessage = () => "Se încarcă...";

const typeSelectStyles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (provided: any) => ({
    ...provided,
    borderColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueContainer: (provided: any) => ({
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
)(({ classes, apiData, value, onChange, compatibleScopes }) => {
  const typeSelect = useElectionScopePickerGetTypeSelectProps(value, onChange, compatibleScopes);
  const selects = useElectionScopePickerGetSelectProps(apiData, value, onChange, compatibleScopes);
  const theme = useTheme();

  const selectTheme = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (t: any) => ({
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
        key={JSON.stringify(compatibleScopes)} // Workaround: The menu list in the Select component doesn't want to re-render on isOptionDisabled change
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
