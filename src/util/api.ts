export type APIInvocation<ResponseType> = (abortSignal?: AbortSignal) => Promise<ResponseType>;

export type APIRequestState<ResponseType> = {
  data: ResponseType | null;
  hasData: boolean;
  loading: boolean;
  error: Error | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export type JSONFetchOptions<BodyType = unknown, QueryParamsType extends Record<string, any> = any> = {
  body?: BodyType;
  query?: QueryParamsType;
  headers?: Record<string, string>;
  fetchOptions?: RequestInit;
};

const defaultHttpErrorHandler = (response: Response) => {
  throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
};

export type JSONFetch = <ResponseType = unknown, BodyType extends Record<string, any> = any, QueryParamsType = unknown>(
  method: string,
  endpoint: string,
  options?: JSONFetchOptions<BodyType, QueryParamsType>,
) => APIInvocation<ResponseType>;

export function makeJsonFetch(
  urlPrefix = "",
  defaultHeaders: Record<string, string> = {},
  handleHttpError: (res: Response) => Promise<any> | never = defaultHttpErrorHandler,
  handleData: (data: any) => any = (x) => x,
): JSONFetch {
  return function jsonFetch<
    ResponseType = unknown,
    BodyType extends Record<string, any> = any,
    QueryParamsType = unknown
  >(method: string, endpoint: string, options: JSONFetchOptions<BodyType, QueryParamsType> = {}) {
    const { body, query, headers, fetchOptions } = options;

    const sentHeaders: Record<string, string> = {
      ["Accept"]: "application/json",
    };
    if (body != null) {
      sentHeaders["Content-Type"] = "application/json";
    }
    Object.assign(sentHeaders, defaultHeaders);
    Object.assign(sentHeaders, headers);

    const searchParams = new URLSearchParams();
    if (query) {
      for (const key in query) {
        const value = query[key];
        if (value != null) {
          searchParams.set(key, (value as any).toString());
        }
      }
    }
    const searchString = searchParams.toString();
    const url = urlPrefix + endpoint + (searchString ? "?" + searchString : "");

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
  QueryParamsType extends Record<string, any> = any
> = (request: {
  endpoint: string;
  match: RegExpMatchArray | null;
  body: BodyType;
  query: QueryParamsType;
}) => ResponseType | Promise<ResponseType>;

export type APIMockEntry<
  ResponseType = unknown,
  BodyType = unknown,
  QueryParamsType extends Record<string, any> = any
> = [string, RegExp | string, APIMockHandler<ResponseType, BodyType, QueryParamsType>];

export function mockFetch(entries: APIMockEntry<any, any, any>[]): JSONFetch {
  return function (method: string, endpoint: string, options: JSONFetchOptions = {}) {
    let match: RegExpMatchArray | null;
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

export const transformApiInvocation = <TFrom, TTo>(
  invocation: APIInvocation<TFrom>,
  transform: (data: TFrom) => TTo,
): APIInvocation<TTo> => {
  return (abortSignal) => invocation(abortSignal).then(transform);
};
