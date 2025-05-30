import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:bg-accent-hover transition-colors">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent-contrast"
        >
          <path
            d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="text-xl font-bold text-body">Glowybits</span>
    </Link>
  );
}
