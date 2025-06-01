"use client";

import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getImages } from "@/services/images";
import ImageCard from "./image-card";
import { toast } from "sonner";
import ImageLoader from "./image-loading";
import NoResults from "./no-results";

export default function ImageFeed() {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { data, isPending, isError, isSuccess, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["images", query],
      queryFn: ({ pageParam = 0 }) => getImages({ pageParam, query }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const hasNoResults =
    data?.pages.every((page) => page.images.length === 0) && query !== "";

  return (
    <div className="m-5">
      {isPending && <ImageLoader number_of_cards={10} />}
      {isError &&
        toast.message("Error occurred!", {
          description:
            "An error has happened while trying to fetch page images. Please try refreshing the page.",
        })}
      {isSuccess && (
        <>
          {hasNoResults ? (
            <NoResults query={query} />
          ) : (
            <section className="masonry columns-2 md:columns-3 gap-1">
              {data.pages.flatMap((page) =>
                page.images.map((image) => (
                  <div key={image.id} className="m-2 relative group">
                    <ImageCard image={image} />
                  </div>
                ))
              )}
            </section>
          )}
        </>
      )}
      <div ref={ref}></div>
    </div>
  );
}
