import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-forest text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
    >
      Skip to main content
    </Link>
  );
}

