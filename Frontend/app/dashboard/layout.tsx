import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitor and analyze document compliance with SEBI regulations',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}