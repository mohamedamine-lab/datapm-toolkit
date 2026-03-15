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
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">Data</span>PM
        </span>
        <Link
          href="/app"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Open Tool →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6 border border-indigo-500/20">
          v0.1 — Free during beta
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
          Generate data project artifacts{' '}
          <span className="text-indigo-400">in seconds</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl">
          AI-powered tool for Data PMs and BI Managers. Project charters, KPI
          frameworks, data specs, stakeholder deck outlines — ready in one click.
        </p>

        <Link
          href="/app"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg transition mb-16 text-lg"
        >
          Try the Tool →
        </Link>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 text-left w-full mb-20">
          {[
            {
              title: 'Smart Prompts',
              desc: 'Tailored AI prompts for each artifact type — no generic output.',
              icon: '⚡',
            },
            {
              title: 'Export to DOCX',
              desc: 'Download your artifact as a Word document, ready for stakeholders.',
              icon: '📄',
            },
            {
              title: 'Zero Setup',
              desc: 'No account needed. Describe your project, pick an artifact, generate.',
              icon: '🚀',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div className="w-full max-w-md mb-20">
          <h2 className="text-2xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-gray-400 text-sm mb-6">
            Get notified when we launch new artifact types and features.
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {loading ? '...' : 'Join Waitlist'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-sm text-gray-500">
        © 2026 DataPM Toolkit. Built with Next.js & Gemini.
      </footer>
    </div>
  );
}
