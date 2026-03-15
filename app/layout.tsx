import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataPM Toolkit — AI-Powered Data Project Artifacts',
  description: 'Generate project charters, KPI frameworks, data specs, and stakeholder deck outlines in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
