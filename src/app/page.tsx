'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Building2 className="mx-auto h-16 w-16 text-indigo-600 animate-pulse" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Arunova</h1>
        <p className="mt-2 text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
}
