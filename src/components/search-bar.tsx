"use client";

import { useState, useEffect } from "react";
import { Search, ImageIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounce API calls to fetch images
  useEffect(() => {
    // Sets value of query parameter "query"
    const createQueryString = (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", query);
      return params.toString();
    };

    const timeout = setTimeout(() => {
      router.push(`?${createQueryString(inputValue)}`);
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [inputValue, router, searchParams]);

  return (
    <div className={`relative`}>
      <div className="relative flex items-center pl-4 bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Search Input */}
        <div className="flex grow items-center gap-1 relative">
          {!inputValue && (
            <ImageIcon width={20} height={20} className="text-body" />
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for high-quality photos"
            className="py-3 grow text-foreground placeholder-body outline-none border-r border-r-border focus:ring-0"
          />
        </div>

        {/* Search Button */}
        <button
          className="px-4 py-3 text-center text-body hover:text-foreground transition-colors hover:font-bold hover:cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
