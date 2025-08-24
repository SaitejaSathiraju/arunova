# Arunova Setup Guide

## 🚀 Quick Setup

### 1. Database Setup (Supabase)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `zautayodyhzkucthwqtb`
3. **Navigate to SQL Editor** (left sidebar)
4. **Copy and paste** the contents of `supabase-setup.sql`
5. **Run the script** to create tables and sample data

### 2. Run the Application

```bash
# The dev server should already be running
npm run dev
```

**Open**: http://localhost:3000

### 3. Test the Application

#### Admin Login
- **Email**: admin@arunova.com
- **Password**: admin123
- **Access**: Full property management

#### User Login  
- **Email**: user@arunova.com
- **Password**: user123
- **Access**: View-only access to available properties

## 🔧 What's Been Set Up

### ✅ **Frontend Components**
- Login page with hardcoded credentials
- Admin dashboard (add/edit/delete properties)
- User dashboard (view available properties only)
- Role-based routing and access control

### ✅ **Database Integration**
- Supabase client configured with your credentials
- Properties table with proper schema
- Row Level Security (RLS) policies
- Sample data for testing

### ✅ **Key Features**
- **Admin**: Full CRUD operations on properties
- **User**: View only available properties
- **Search & Filter**: By title, description, location, rent
- **Status Control**: Available/Unavailable properties
- **Responsive Design**: Works on all devices

## 🗄️ Database Schema

The `properties` table includes:
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)  
- `rent` (Decimal)
- `status` (available/unavailable)
- `location` (Text)
- `images` (Text array)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **Users can only see available properties**
- **Admins have full access** to all properties
- **Authentication required** for all operations

## 🚨 Troubleshooting

### If you see "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### If properties don't load
1. Check Supabase dashboard for any errors
2. Verify the SQL script ran successfully
3. Check browser console for error messages

### If login doesn't work
- Verify the hardcoded credentials in `src/contexts/AuthContext.tsx`
- Check that the AuthProvider is wrapping your app in `layout.tsx`

## 🎯 Next Steps

1. **Test the application** with both admin and user accounts
2. **Add some properties** using the admin account
3. **Switch to user account** to verify they only see available properties
4. **Customize the UI** as needed
5. **Add image upload functionality** to Supabase Storage

## 📱 Test Scenarios

### Admin Flow
1. Login as admin
2. Add a new property (set as unavailable)
3. Switch to user account - property should not be visible
4. Switch back to admin - change property to available
5. Switch to user account - property should now be visible

### User Flow
1. Login as user
2. Search and filter properties
3. Verify only available properties are shown
4. Test search functionality

The application is now fully functional with your Supabase database! 🎉
