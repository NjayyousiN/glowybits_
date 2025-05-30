import Link from "next/link";
import { Home, Search, Upload, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-muted rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-accent" />
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-title mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-subtitle mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-body max-w-md mx-auto leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The image or
              page you requested may have been moved, deleted, or the URL might
              be incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-foreground px-6 py-3 rounded-lg font-medium border border-border transition-colors"
            >
              <Search className="h-5 w-5" />
              Explore Images
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-border pt-8">
            <h3 className="text-lg font-semibold text-subtitle mb-4">
              What would you like to do?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <Link
                href="/upload"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-border hover:border-accent hover:bg-accent-muted transition-all group"
              >
                <Upload className="h-6 w-6 text-body group-hover:text-accent" />
                <span className="text-sm font-medium text-[var(--subtitle)]">
                  Upload Image
                </span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-border hover:border-accent hover:bg-accent-muted transition-all group"
              >
                <Search className="h-6 w-6 text-body group-hover:text-accent" />
                <span className="text-sm font-medium text-[var(--subtitle)]">
                  Browse Gallery
                </span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-border hover:border-accent hover:bg-accent-muted transition-all group"
              >
                <AlertCircle className="h-6 w-6 text-body group-hover:text-accent" />
                <span className="text-sm font-medium text-subtitle">
                  Get Help
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
