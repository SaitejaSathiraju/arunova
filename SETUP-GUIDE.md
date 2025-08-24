# Arunova Setup Guide

## 🗄️ Database Setup

### 1. Run the Database Schema
In your Supabase dashboard, go to **SQL Editor** and run the `supabase-setup.sql` file to create the properties table and RLS policies.

### 2. Create Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Set the following:
   - **Name**: `property-images`
   - **Public bucket**: ✅ Checked
   - **File size limit**: 50MB (or your preference)
   - **Allowed MIME types**: `image/*`
4. Click **Create bucket**

## 🔐 Authentication Setup

The app uses hardcoded credentials for demo purposes:

**Admin Login:**
- Email: `admin@arunova.com`
- Password: `admin123`

**User Login:**
- Email: `user@arunova.com`
- Password: `user123`

## 🚀 Running the App

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open http://localhost:3000
4. Login with the credentials above

## 📸 Image Upload Features

- **Admin Dashboard**: Can upload multiple images when adding/editing properties
- **Image Preview**: See selected images before uploading
- **Image Gallery**: Users can view all property images with navigation
- **Property Details**: Full-screen image viewing for users

## 🛠️ Troubleshooting

### Images Not Uploading?
- Check if the `property-images` storage bucket exists in Supabase
- Ensure the bucket is set to public
- Check browser console for error messages

### Database Connection Issues?
- Verify your Supabase URL and anon key in `src/lib/supabase.ts`
- Check if the `properties` table exists
- Ensure RLS policies are properly set

### Build Errors?
- The app is configured to ignore build errors for demo purposes
- Check `next.config.ts` for configuration details

## 📱 Features

✅ **Admin Dashboard**
- Add new properties with images
- Edit existing properties
- Delete properties
- Manage property status (available/unavailable)

✅ **User Dashboard**
- View available properties only
- Search and filter properties
- View property details with full image gallery
- Responsive design for all devices

✅ **Image Management**
- Multiple image upload support
- Image preview before upload
- Interactive image gallery
- Full-screen image viewing
- Image count indicators

## 🔒 Security Features

- Role-based access control (Admin/User)
- Row Level Security (RLS) in Supabase
- Users can only see available properties
- Admin has full CRUD access
- Secure image storage with public read access
