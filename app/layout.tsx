import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taken — Medication Tracker',
  description: 'Medication reminder and tracking system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
