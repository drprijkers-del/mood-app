import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Mood App</h1>
          <p className="text-gray-500">Pink Pollos Lab</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-gray-400 text-sm mt-6">
          Alleen voor administrators
        </p>
      </div>
    </div>
  )
}
