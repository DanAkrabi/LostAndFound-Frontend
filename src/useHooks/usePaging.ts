
import { useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";

export const usePaging = (
  endpointBuilder: (page: number) => string,
  fetcher: (url: string) => Promise<any>,
  extractItems: (page: any) => any[],
  limit = 6
) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && extractItems(previousPageData).length === 0) return null;
    return endpointBuilder(pageIndex + 1);
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

  const items = data ? data.flatMap(extractItems) : [];
  const totalPages = data?.[0]?.totalPages ?? 1;

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isValidating) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && size < totalPages) {
          setSize((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isValidating, size, totalPages, setSize]
  );

  return {
    items,
    lastElementRef,
    size,
    isValidating,
    setSize,
  };
};
