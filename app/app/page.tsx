'use client';

import { useState } from 'react';
import Link from 'next/link';

const ARTIFACT_TYPES = [
  'Project Charter',
  'KPI Framework',
  'Data Specification',
  'Stakeholder Deck Outline',
];

export default function ToolPage() {
  const [projectName, setProjectName] = useState('');
  const [context, setContext] = useState('');
  const [artifactType, setArtifactType] = useState(ARTIFACT_TYPES[0]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !context) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, context, artifactType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setResult('Error: ' + message);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = async () => {
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    const paragraphs = result.split('\n').map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: 'Calibri',
              size: 22,
            }),
          ],
          spacing: { after: 120 },
        })
    );
    const doc = new Document({
      sections: [{ children: paragraphs }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_${artifactType.replace(/\s+/g, '_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">Data</span>PM
        </Link>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">beta</span>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Generate an Artifact</h1>

        <form onSubmit={handleGenerate} className="space-y-5 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Customer 360 Data Platform"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Context
            </label>
            <textarea
              required
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the project, stakeholders, goals, data sources, constraints..."
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Artifact Type
            </label>
            <select
              value={artifactType}
              onChange={(e) => setArtifactType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
            >
              {ARTIFACT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50 w-full"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-400">Generating with Gemini...</span>
          </div>
        )}

        {result && !loading && (
          <div>
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleCopy}
                className="text-sm px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={handleDownloadDocx}
                className="text-sm px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
              >
                📄 Download DOCX
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
