'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">Data</span>PM
        </span>
        <Link
          href="/app"
          className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
        >
          Open Tool <span className="text-lg">→</span>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-8 border border-indigo-500/20">
          v0.1 — Free during beta
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-6">
          Stop writing data project docs{' '}
          <span className="text-indigo-400">from scratch</span>
        </h1>
        <p className="text-lg text-gray-400 mb-4 max-w-2xl leading-relaxed">
          AI-powered artifact generator for Data PMs and BI Managers. 
          Project charters, KPI frameworks, data specs, stakeholder decks — 
          professional quality in seconds.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          No account needed. No credit card. Just describe your project and generate.
        </p>

        <Link
          href="/app"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-10 py-3.5 rounded-lg transition mb-16 text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          Try It Free →
        </Link>

        {/* How it works */}
        <div className="w-full mb-16">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-8 font-medium">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { step: '1', title: 'Describe', desc: 'Enter your project name and context — goals, data sources, stakeholders.' },
              { step: '2', title: 'Choose', desc: 'Pick the artifact type: charter, KPI framework, data spec, or deck outline.' },
              { step: '3', title: 'Generate', desc: 'Get a professional document in ~15 seconds. Copy or download as DOCX.' },
            ].map((s) => (
              <div key={s.step} className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center justify-center mb-3">{s.step}</div>
                <h3 className="font-semibold mb-1 text-gray-200">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 text-left w-full mb-20">
          {[
            {
              title: 'Expert-Level Prompts',
              desc: 'Each artifact uses specialized prompts designed by data PMs — structured, actionable, specific to your context.',
              icon: '⚡',
            },
            {
              title: 'DOCX Export',
              desc: 'Download formatted Word documents with proper headings, tables, and styling. Ready for stakeholders.',
              icon: '📄',
            },
            {
              title: '4 Artifact Types',
              desc: 'Project Charters, KPI Frameworks, Data Specifications, and Stakeholder Deck Outlines.',
              icon: '🎯',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1 text-gray-200">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div className="w-full max-w-md mb-20">
          <h2 className="text-xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-gray-400 text-sm mb-6">
            Get notified when we add new artifact types and features.
          </p>
          {submitted ? (
            <p className="text-green-400 font-medium">✓ You&apos;re on the list!</p>
          ) : (
            <form onSubmit={handleWaitlist} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {loading ? '...' : 'Join'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/40 px-6 py-6 text-center text-xs text-gray-600">
        Built with Next.js & Gemini · © 2026 DataPM Toolkit
      </footer>
    </div>
  );
}
