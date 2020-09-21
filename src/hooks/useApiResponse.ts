import { useEffect, useState } from "react";
import { APIInvocation, APIRequestState } from "../util/api";

export type UseAPIResponseOptions<ResponseType> = {
  invocation?: APIInvocation<ResponseType> | null;
  discardPreviousData?: boolean; // Defaults to false
  discardDataOnError?: boolean; // Defaults to false
  abortPreviousRequest?: boolean; // Defaults to true
};

export function useApiResponse<ResponseType>(
  makeInvocation: () => APIInvocation<ResponseType> | UseAPIResponseOptions<ResponseType> | undefined | void | null,
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
    const options: UseAPIResponseOptions<ResponseType> = (typeof inv === "function" ? { invocation: inv } : inv) || {};
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
          hasData: discardDataOnError ? false : prevState.hasData,
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
