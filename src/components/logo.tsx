import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
      <div className="bg-gradient-to-br from-accent to-accent-hover p-1.5 rounded-lg shadow-lg">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent font-bold">
        GlowyBits
      </span>
    </Link>
  );
}
