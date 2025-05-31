import { Skeleton } from "@/components/ui/skeleton";

interface ImageLoaderProps {
  number_of_cards: number;
}

export default function ImageLoader({ number_of_cards }: ImageLoaderProps) {
  return (
    <div className="columns-3 gap-1">
      {Array.from({ length: number_of_cards }).map((_, idx) => (
        <Skeleton key={idx} className="h-[250px] w-[400px] rounded-xl mb-2" />
      ))}
    </div>
  );
}
