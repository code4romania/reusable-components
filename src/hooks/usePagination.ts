import { useCallback, useState } from "react";

export type PaginationResponse = {
  buttonText: string;
  limit: number;
  canCollapse: boolean;
  onToggleCollapsed: () => unknown;
};

export type PaginationOptions = {
  total: number;
  size: number;
};

export function usePagination({ total, size }: PaginationOptions): PaginationResponse {
  const [limit, setLimit] = useState<number>(size);

  const onToggleCollapsed = useCallback(() => {
    setLimit((currentLimit) => (currentLimit < total ? currentLimit + size : size));
  }, []);

  const showMoreText = "Afișează mai multe rezultate";
  const showLessText = "Ascunde rezultatele";
  const canCollapse = total > size;
  const showMore = total > limit;
  const buttonText = showMore ? showMoreText : showLessText;

  return { buttonText, limit, canCollapse, onToggleCollapsed };
}
