import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="text-6xl mb-6 animate-pulse-ring inline-block">🎯</div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Mood App</span>
        </h1>
        <p className="text-xl text-gray-500 mb-2">
          Pink Pollos Lab
        </p>
        <p className="text-gray-400 mb-12">
          Track je team mood en verbeter de teamdynamiek
        </p>

        {/* CTA */}
        <Link href="/admin/login">
          <Button size="lg">
            Admin Login
          </Button>
        </Link>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl text-center">
        <div>
          <div className="text-3xl mb-2">😊</div>
          <h3 className="font-medium text-gray-900">Dagelijkse check-ins</h3>
          <p className="text-sm text-gray-500">1 klik per dag</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-medium text-gray-900">Anoniem</h3>
          <p className="text-sm text-gray-500">Veilig en privé</p>
        </div>
        <div>
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-medium text-gray-900">Team trends</h3>
          <p className="text-sm text-gray-500">Inzicht in mood</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-gray-400">
        Pink Pollos Lab
      </footer>
    </div>
  )
}
