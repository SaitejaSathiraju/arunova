import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zautayodyhzkucthwqtb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdXRheW9keWh6a3VjdGh3cXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjYzMjUsImV4cCI6MjA3MTY0MjMyNX0.LAGd7dPUCNOyBywCKfLryS3UqzqqOF5BTr6M8NHrTGw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
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
