import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  number_of_cards: number;
}

export default function SkeletonCard({ number_of_cards }: SkeletonCardProps) {
  return (
    <div className="columns-3 gap-1">
      {Array.from({ length: number_of_cards }).map((_, idx) => (
        <Skeleton key={idx} className="h-[125px] w-[250px] rounded-xl mb-2" />
      ))}
    </div>
  );
}
