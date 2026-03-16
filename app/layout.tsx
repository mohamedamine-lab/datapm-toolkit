import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataPM Toolkit — AI-Powered Data Project Artifacts',
  description: 'Generate project charters, KPI frameworks, data specs, and stakeholder deck outlines in seconds. Free AI tool for Data PMs and BI Managers.',
  openGraph: {
    title: 'DataPM Toolkit — Generate Data Project Artifacts in Seconds',
    description: 'AI-powered tool for Data PMs. Project charters, KPI frameworks, data specs — ready in one click.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
