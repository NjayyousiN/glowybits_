import { FileSearch } from "lucide-react";

interface NoResultsProps {
  query: string;
}

export default function NoResults({ query }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <FileSearch className="w-16 h-16 text-subtitle" />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-title mb-2">
          No images found
        </h2>
        <p className="text-subtitle">
          {query
            ? `No results found for "${query}"`
            : "Try adjusting your search"}
        </p>
      </div>
    </div>
  );
}
