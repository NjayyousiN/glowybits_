"use client";

import { useState, useEffect } from "react";
import { Search, ImageIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sets value of query parameter "query"
  const createQueryString = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", query);
    return params.toString();
  };

  // Debounce API calls to fetch images
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(`?${createQueryString(inputValue)}`);
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className={`relative`}>
      <div className="relative flex justify-between items-center px-4 bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-1 relative">
          {!inputValue && (
            <ImageIcon width={20} height={20} className="text-body" />
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for high-quality photos"
            className="py-3 text-foreground placeholder-body outline-none focus:ring-0"
          />
        </div>

        {/* Search Button */}
        <button
          className="px-4 py-3 text-body hover:text-foreground transition-colors hover:font-bold hover:cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
