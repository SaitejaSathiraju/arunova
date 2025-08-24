'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Property, supabase } from '@/lib/supabase'
import { 
  Building2, 
  LogOut, 
  MapPin,
  DollarSign,
  Search,
  Filter,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [rentFilter, setRentFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login')
      return
    }
    loadProperties()
  }, [user, router])

  useEffect(() => {
    filterProperties()
  }, [properties, searchTerm, locationFilter, rentFilter])

  const loadProperties = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = properties.filter(property => 
      property.status === 'available' && // Ensure only available properties are shown
      (searchTerm === '' || 
       property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       property.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (locationFilter === '' || 
       property.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (rentFilter === '' || property.rent <= parseFloat(rentFilter))
    )
    setFilteredProperties(filtered)
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user || user.role !== 'user') {
    return null
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
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Search Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent ($)</label>
              <input
                type="number"
                placeholder="Maximum rent..."
                value={rentFilter}
                onChange={(e) => setRentFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Available Properties ({filteredProperties.length})
            </h3>
          </div>
          <div className="overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
                <p className="mt-2 text-gray-600">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {properties.length === 0 
                    ? "No properties are currently available." 
                    : "Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Property Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <ImageGallery images={property.images} title={property.title} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{property.title}</h4>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${property.rent}/month
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </div>
                      </div>
                      
                      {/* Image Count Indicator */}
                      {property.images && property.images.length > 0 && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {property.images.length} image{property.images.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <button 
                          onClick={() => router.push(`/dashboard/user/${property.id}`)}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

