import { Clock } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      <Clock className="w-12 h-12 text-blue-500 mb-4 animate-pulse" />
      <h1 className="text-4xl font-bold mb-2 text-white">Upgrade to Pro – Coming Soon</h1>
      <p className="text-gray-400 max-w-md mb-6">
        We’re almost ready to launch Pro plans with premium features for developers like you.
        Stay tuned for updates — exciting things are on the way!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
      >
        Go Back Home
      </Link>
    </main>
  );
}
