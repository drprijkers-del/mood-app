import { redirect } from 'next/navigation'

interface TeamCeremoniesPageProps {
  params: Promise<{ id: string }>
}

export default async function TeamCeremoniesPage({ params }: TeamCeremoniesPageProps) {
  const { id } = await params
  // Redirect to unified team page with ceremonies tab selected
  redirect(`/teams/${id}?tab=ceremonies`)
}
