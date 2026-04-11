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

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Instant Policy Answers",
    desc: "Get accurate, context-aware answers from your company policy documents in seconds — no more manual searching.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure & Private",
    desc: "Your company data stays within your infrastructure. Built with enterprise-grade security and data privacy standards.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Source-Cited Responses",
    desc: "Every answer is backed by specific policy sections, so employees and managers can verify information at a glance.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Powered by a state-of-the-art RAG pipeline, delivering precise responses with minimal latency.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Team-Wide Access",
    desc: "Empower every employee — from HR to engineering — with a single unified interface for all policy-related queries.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Always Up-to-Date",
    desc: "Easily refresh the knowledge base whenever policies are updated — the assistant stays current with your latest documents.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Ask Your Question",
    desc: "Type any question related to XYZ company policies in plain English — no special syntax needed.",
  },
  {
    step: "02",
    title: "AI Retrieves Context",
    desc: "The RAG engine searches your policy documents and retrieves the most relevant passages in real time.",
  },
  {
    step: "03",
    title: "Get a Clear Answer",
    desc: "Receive a concise, accurate answer with cited sources directly from your company's official documents.",
  },
];

const FAQS = [
  {
    q: "What documents does the assistant have access to?",
    a: "The assistant is trained on all of XYZ Company's official policy documents including HR policies, code of conduct, IT usage policies, leave management, and more.",
  },
  {
    q: "Can the assistant answer questions outside company policy?",
    a: "The assistant is scoped strictly to company policy content. It will let you know if a question falls outside the available documentation.",
  },
  {
    q: "Is my conversation data stored?",
    a: "Conversations are processed securely and are not stored beyond your active session, ensuring full privacy for all employees.",
  },
  {
    q: "How accurate are the responses?",
    a: "The RAG architecture ensures answers are grounded in actual document content, significantly reducing hallucinations and improving reliability.",
  },
  {
    q: "Who can access the Policy Assistant?",
    a: "Access is available to all verified XYZ Company employees. Contact IT support to report any access issues.",
  },
];

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-600/8 blur-[100px]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Retrieval-Augmented Generation (RAG)
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Company Policy
            </span>
            <br />
            Answered Instantly
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ask any question about XYZ Company policies and get precise, source-backed
            answers in seconds. No more hunting through documents — just ask.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="http://localhost:3000/chat"
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
                Start Chatting Now
              </span>
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full border border-white/10 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Hero chat preview card */}
          <div className="mt-20 max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-left shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-gray-500">PolicyAI Chat</span>
            </div>
            {/* Mock chat messages */}
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-indigo-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                  How many days of annual leave am I entitled to?
                </div>
              </div>
              <div className="flex justify-start gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                  </svg>
                </div>
                <div className="bg-white/8 border border-white/10 text-gray-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-sm">
                  According to{" "}
                  <span className="text-indigo-300 font-medium">Leave Policy §3.2</span>,
                  full-time employees are entitled to <span className="text-white font-semibold">21 days</span> of annual leave per year, accrued monthly.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-indigo-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                  What is the remote work policy?
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-9">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-gray-500">PolicyAI is typing…</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "< 2s", label: "Average Response Time" },
            { value: "100%", label: "Policy Coverage" },
            { value: "24/7", label: "Always Available" },
            { value: "0", label: "Manual Searches Needed" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to navigate
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                company policies effortlessly
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Built specifically for XYZ Company employees — accurate, fast, and always available.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Three steps to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                instant clarity
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Our RAG-powered assistant makes finding policy answers simpler than ever.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-violet-500/40 via-indigo-500/40 to-blue-500/40" />

            {STEPS.map((s) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div
                  className="relative w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-2xl font-black"
                  style={{
                    background: `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))`,
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  <span className="bg-gradient-to-br from-violet-300 to-indigo-400 bg-clip-text text-transparent">
                    {s.step}
                  </span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-[#0a0f1e]" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href="http://localhost:3000/chat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
              </svg>
              Try It Now — Open the Chat
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know about the XYZ PolicyAI assistant.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === idx
                  ? "border-indigo-500/40 bg-indigo-500/8"
                  : "border-white/8 bg-white/[0.03] hover:border-white/15"
                  }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-white text-sm sm:text-base">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-indigo-400 flex-shrink-0 ml-4 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-transparent p-12 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/15 blur-[80px]" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-indigo-500/30 mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Ready to get your
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  policy questions answered?
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
                Launch the AI chat assistant and start getting instant, accurate answers from XYZ Company's official policy documents.
              </p>
              <a
                href="http://localhost:3000/chat"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-lg font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
                Open PolicyAI Chat
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-300">
              XYZ <span className="text-indigo-400">PolicyAI</span>
            </span>
          </div>

          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} XYZ Company. Internal use only. All rights reserved.
          </p>

          <a
            href="http://localhost:3000/chat"
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
          >
            Launch Chat
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </footer>

    </div>
  );
}
