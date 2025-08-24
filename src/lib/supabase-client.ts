import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = 'https://zautayodyhzkucthwqtb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdXRheW9keWh6a3VjdGh3cXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjYzMjUsImV4cCI6MjA3MTY0MjMyNX0.LAGd7dPUCNOyBywCKfLryS3UqzqqOF5BTr6M8NHrTGw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for production use
export interface Property {
  id: string
  title: string
  description: string
  rent: number
  status: 'available' | 'unavailable'
  location: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  name: string
}

// Production database operations
export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getAvailableProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
