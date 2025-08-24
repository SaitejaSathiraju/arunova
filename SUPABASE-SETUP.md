# Supabase Setup Guide - No Permission Errors!

## 🚫 **Problem Solved**
The error `ERROR: 42501: must be owner of table objects` occurs when trying to modify system tables. This guide avoids that completely!

## 📋 **Step 1: Database Setup (SQL Editor)**

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute

This will create:
- ✅ Properties table
- ✅ RLS policies
- ✅ Sample data
- ✅ Indexes for performance

## 🗂️ **Step 2: Storage Setup (Dashboard)**

1. In your **Supabase Dashboard**, click **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Fill in the details:
   - **Name**: `property-images`
   - **Public bucket**: ✅ **Check this box**
   - **File size limit**: `50MB`
   - **Allowed MIME types**: `image/*`
4. Click **Create bucket**

## 🔐 **Step 3: Test the Setup**

1. Go to **Table Editor** → **properties**
2. You should see 3 sample properties
3. Go to **Storage** → **property-images**
4. The bucket should be visible and public

## ✅ **What This Approach Does**

- **No system table modifications** - avoids permission errors
- **Uses default Supabase permissions** - works out of the box
- **Simple and reliable** - no complex policies to debug
- **Public read access** - images are accessible to everyone
- **Authenticated uploads** - only logged-in users can upload

## 🎯 **Why This Works**

Supabase automatically handles:
- ✅ Public read access for public buckets
- ✅ Authenticated user uploads
- ✅ File security and permissions
- ✅ CDN and optimization

## 🚀 **Ready to Test**

After completing these steps:
1. Your database will have the properties table
2. Storage will be configured for image uploads
3. The app will work without permission errors
4. Admins can upload images
5. Users can view properties and images

## 🆘 **If You Still Get Errors**

- Make sure you're using the **SQL Editor** (not a custom query)
- Ensure you're logged into the correct Supabase project
- Check that the bucket name is exactly `property-images`
- Verify the bucket is marked as **public**
