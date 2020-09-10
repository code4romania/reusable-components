import { useEffect, useState } from "react";

export type APIInvocation<ResponseType> = (abortSignal?: AbortSignal) => Promise<ResponseType>;

export type APIRequestState<ResponseType> = {
  data: ResponseType | null;
  hasData: boolean;
  loading: boolean;
  error: Error | null;
};

export type UseAPIResponseOptions<ResponseType> = {
  invocation?: APIInvocation<ResponseType> | null;
  discardPreviousData?: boolean; // Defaults to false
  discardDataOnError?: boolean; // Defaults to false
  abortPreviousRequest?: boolean; // Defaults to true
};

export function useApiResponse<ResponseType>(
  makeInvocation: () => APIInvocation<ResponseType> | UseAPIResponseOptions<ResponseType> | void,
  dependencies: unknown[],
): APIRequestState<ResponseType> {
  const [state, setState] = useState<APIRequestState<ResponseType>>({
    data: null,
    hasData: false,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const inv = makeInvocation();
    const options: UseAPIResponseOptions<ResponseType> = typeof inv === "function" ? { invocation: inv } : {};
    const {
      invocation,
      discardPreviousData = false,
      discardDataOnError = false,
      abortPreviousRequest = true,
    } = options;

    if (!invocation && !discardPreviousData) return;

    setState((prevState) => ({
      data: discardPreviousData ? null : prevState.data,
      hasData: discardPreviousData ? false : prevState.hasData,
      loading: invocation != null,
      error: invocation != null || discardPreviousData ? null : prevState.error,
    }));

    if (!invocation) return;

    const abortController = new AbortController();

    let mounted = true;
    invocation(abortController.signal).then(
      (data) => {
        if (!mounted) return;
        setState({
          data,
          hasData: true,
          loading: false,
          error: null,
        });
      },
      (error) => {
        if (!mounted) return;
        setState((prevState) => ({
          data: discardDataOnError ? null : prevState.data,
          hasData: discardDataOnError ? null : prevState.hasData,
          loading: false,
          error,
        }));
      },
    );

    return () => {
      mounted = false;
      if (abortPreviousRequest) {
        abortController.abort();
      }
    };
  }, dependencies);

  return state;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export type JSONFetchOptions<BodyType = unknown, QueryParamsType extends Record<string, any> = unknown> = {
  body?: BodyType;
  query?: QueryParamsType;
  headers?: Record<string, string>;
  fetchOptions?: RequestInit;
};

const defaultHttpErrorHandler = (response: Response) => {
  throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
};

export type JSONFetch = <
  ResponseType = unknown,
  BodyType extends Record<string, any> = unknown,
  QueryParamsType = unknown
>(
  method?: string,
  endpoint?: string,
  options?: JSONFetchOptions<BodyType, QueryParamsType>,
) => APIInvocation<ResponseType>;

export function makeJsonFetch(
  urlPrefix = "",
  defaultHeaders: Record<string, string> = {},
  handleHttpError: (Response) => Promise<any> | never = defaultHttpErrorHandler,
  handleData: (any) => any = (x) => x,
): JSONFetch {
  return function jsonFetch<
    ResponseType = unknown,
    BodyType extends Record<string, any> = unknown,
    QueryParamsType = unknown
  >(method: string, endpoint: string, options: JSONFetchOptions<BodyType, QueryParamsType> = {}) {
    const { body, query, headers, fetchOptions } = options;

    const sentHeaders: Record<string, string> = { ...defaultHeaders };
    if (body != null) {
      headers["Content-Type"] = "application/json";
    }
    Object.assign(sentHeaders, headers);

    const searchParams = new URLSearchParams();
    if (query) {
      for (const key in query) {
        searchParams.set(key, query[key].toString());
      }
    }
    const searchString = searchParams.toString();
    const url = urlPrefix + method + (searchString ? "?" + searchString : "");

    return async (signal) => {
      const response = await fetch(url, {
        signal,
        method,
        body: body != null ? JSON.stringify(body) : undefined,
        headers: sentHeaders,
        ...fetchOptions,
      });

      if (!response.ok) {
        return (await handleHttpError(response)) as ResponseType;
      }

      return (await handleData(await response.json())) as ResponseType;
    };
  };
}

export const jsonFetch = makeJsonFetch();

export type APIMockHandler<
  ResponseType = unknown,
  BodyType = unknown,
  QueryParamsType extends Record<string, any> = unknown
> = (request: {
  endpoint: string;
  match: RegExpMatchArray;
  body: BodyType;
  query: QueryParamsType;
}) => ResponseType | Promise<ResponseType>;

export type APIMockEntry<
  ResponseType = unknown,
  BodyType = unknown,
  QueryParamsType extends Record<string, any> = unknown
> = [string, RegExp | string, APIMockHandler<ResponseType, BodyType, QueryParamsType>];

export function mockFetch(entries: APIMockEntry<any, any, any>[]): JSONFetch {
  return function (method: string, endpoint: string, options: JSONFetchOptions = {}) {
    let match: RegExpMatchArray;
    const entry = entries.find(([mtod, regexp]) => {
      if (mtod !== method) return false;

      match = typeof regexp == "string" ? (regexp === endpoint ? [endpoint] : null) : endpoint.match(regexp);
      if (!match) return false;

      return true;
    });

    if (entry) {
      return async () => await entry[2]({ endpoint, match, body: options.body ?? {}, query: options.query ?? {} });
    }
    return async () => {
      throw new Error("Endpoint doesn't match any mock");
    };
  };
}
