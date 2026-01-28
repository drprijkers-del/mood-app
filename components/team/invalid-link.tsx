interface InvalidLinkProps {
  message?: string
}

export function InvalidLink({ message }: InvalidLinkProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔗</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Link niet geldig
        </h1>
        <p className="text-gray-500">
          {message || 'Deze link is niet geldig of verlopen. Vraag je teamleader om een nieuwe uitnodigingslink.'}
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-gray-400">
        Pink Pollos Lab
      </footer>
    </div>
  )
}
