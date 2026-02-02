import { redirect } from 'next/navigation'

interface TeamVibePageProps {
  params: Promise<{ id: string }>
}

export default async function TeamVibePage({ params }: TeamVibePageProps) {
  const { id } = await params
  // Redirect to unified team page with vibe tab selected
  redirect(`/teams/${id}?tab=vibe`)
}
