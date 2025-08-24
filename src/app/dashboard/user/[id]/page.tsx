'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Property, supabase } from '@/lib/supabase'
import { 
  Building2, 
  LogOut, 
  MapPin,
  DollarSign,
  Calendar,
  ArrowLeft,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'

export default function PropertyDetails() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login')
      return
    }
    loadProperty()
  }, [user, router, propertyId])

  const loadProperty = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('status', 'available')
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setError('Property not found or not available')
        } else {
          throw error
        }
        return
      }
      
      setProperty(data)
    } catch (error) {
      console.error('Error loading property:', error)
      setError('Failed to load property details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleBack = () => {
    router.push('/dashboard/user')
  }

  if (!user || user.role !== 'user') {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">Arunova Properties</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This property is not available or has been removed.'}</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Arunova Properties</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </button>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Property Images */}
          <div className="h-96 bg-gray-200 relative overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <ImageGallery images={property.images} title={property.title} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-24 w-24 text-gray-400" />
                <span className="ml-2 text-gray-500 text-lg">No images available</span>
              </div>
            )}
          </div>

          {/* Property Information */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <p className="text-xl text-gray-600">{property.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">${property.rent}</div>
                <div className="text-sm text-gray-500">per month</div>
                <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  Available
                </span>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{property.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">${property.rent}/month</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Listed on {new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                {property.images && property.images.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {property.images.length} image{property.images.length !== 1 ? 's' : ''} available
                    </div>
                    <p className="text-sm text-gray-500">Click on the main image above to view all images in full screen</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No images available for this property</div>
                )}
              </div>
            </div>

            {/* Full Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Full Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
                  Contact Owner
                </button>
                <button className="flex-1 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors">
                  Schedule Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
