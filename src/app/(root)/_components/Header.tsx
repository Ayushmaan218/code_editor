import { currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import React from 'react';
import { api } from '../../../../convex/_generated/api';
import { Blocks, Code2, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";


async function HeaderPanel() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();
  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || '',
  });

  return (
    <div className="relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-[#0a0a0f]/80 backdrop-blur-xl p-3 sm:p-4 md:p-6 mb-2 sm:mb-4 rounded-lg gap-3 sm:gap-4">
        {/* Left section */}
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative">
            {/* Logo hover effect */}
            <div
              className="absolute -inset-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
            />
            {/* Logo */}
            <div
              className="relative bg-linear-to-br from-[#1a1a2e] to-[#0a0a0f] p-1.5 sm:p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
            >
              <Blocks className="size-5 sm:size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="block text-base sm:text-lg font-semibold bg-linear-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                Codexly
              </span>
              <span className="hidden sm:block text-xs text-blue-400/60 font-medium">
                Interactive Code Editor
              </span>
            </div>
          </Link>

          {/* Navigation - Show on mobile as icon only */}
          <nav className="lg:hidden">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
              aria-label="Snippets"
            >
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="hidden sm:inline text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Snippets
              </span>
            </Link>
          </nav>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-linear-to-r from-blue-500/10 
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span
                className="text-sm font-medium relative z-10 group-hover:text-white
                 transition-colors"
              >
                Snippets
              </span>
            </Link>
          </nav>
        </div>

        {/* Right section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {!convexUser?.isPro && (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-linear-to-r from-amber-500/10 
                  to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                  transition-all duration-300"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-xs sm:text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            )}
            <Link
              href="/donations" 
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg border border-pink-500/20 hover:border-pink-500/40 bg-linear-to-r from-pink-500/10 
                to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 
                transition-all duration-300"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 hover:text-pink-300" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium text-pink-400/90 hover:text-pink-300">
                Donate
              </span>
            </Link>
            <RunButton />
            <div className="pl-2 sm:pl-3 border-l border-gray-800">
              <HeaderProfileBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderPanel;
