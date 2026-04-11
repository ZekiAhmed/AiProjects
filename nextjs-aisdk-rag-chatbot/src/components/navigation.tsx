// import {
//   SignInButton,
//   SignOutButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
// } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// export const Navigation = () => {
//   return (
//     <nav className="border-b border-[var(--foreground)]/10">
//       <div className="flex container h-16 items-center justify-between px-4  mx-auto">
//         <div className="text-xl font-semibold">RAG Chatbot</div>

//         <div className="flex gap-2">
//           <SignedOut>
//             <SignInButton mode="modal">
//               <Button variant="ghost">Sign In</Button>
//             </SignInButton>
//             <SignUpButton mode="modal">
//               <Button>Sign Up</Button>
//             </SignUpButton>
//           </SignedOut>

//           <SignedIn>
//             <SignOutButton>
//               <Button variant="outline">Sign Out</Button>
//             </SignOutButton>
//           </SignedIn>
//         </div>
//       </div>
//     </nav>
//   );
// };

"use client"

import { useState, useEffect } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-white/5"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"
              />
            </svg>
          </div>
          {/* <span > */}
            <Link href="/" className="font-bold text-lg tracking-tight text-white">
              <span className="text-red-800">XYZ</span> <span className="text-indigo-400">PolicyAI</span>
            </Link>
          {/* </span> */}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {scrolled && NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Auth Buttons — Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="my">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="my2">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <Button variant="my">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1226] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {scrolled && NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}

          {/* Auth Buttons — Mobile */}
          <div className="flex flex-col gap-2 mt-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="secondary" className="w-full justify-center">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-center">Sign Up</Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <Button variant="outline" className="w-full justify-center">
                  Sign Out
                </Button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
