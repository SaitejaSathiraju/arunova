import { supabase } from './supabase'

export async function uploadPropertyImages(files: File[], propertyId: string): Promise<string[]> {
  const imageUrls: string[] = []
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${propertyId}_${Date.now()}_${i}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)
      
      if (error) {
        console.error('Error uploading image:', error)
        continue
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)
      
      if (urlData.publicUrl) {
        imageUrls.push(urlData.publicUrl)
      }
    }
  } catch (error) {
    console.error('Error in uploadPropertyImages:', error)
  }
  
  return imageUrls
}

export async function deletePropertyImages(imageUrls: string[]): Promise<void> {
  try {
    for (const imageUrl of imageUrls) {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop()
      if (filename) {
        await supabase.storage
          .from('property-images')
          .remove([filename])
      }
    }
  } catch (error) {
    console.error('Error deleting images:', error)
  }
}

export async function updatePropertyImages(
  newFiles: File[], 
  propertyId: string, 
  existingImageUrls: string[] = []
): Promise<string[]> {
  try {
    // Delete existing images
    if (existingImageUrls.length > 0) {
      await deletePropertyImages(existingImageUrls)
    }
    
    // Upload new images
    const newImageUrls = await uploadPropertyImages(newFiles, propertyId)
    
    return newImageUrls
  } catch (error) {
    console.error('Error updating property images:', error)
    return []
  }
}

// Helper function to check if storage is properly configured
export async function checkStorageSetup(): Promise<boolean> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
      console.error('Storage not accessible:', error)
      return false
    }
    
    const propertyImagesBucket = buckets?.find(bucket => bucket.name === 'property-images')
    return !!propertyImagesBucket
  } catch (error) {
    console.error('Error checking storage setup:', error)
    return false
  }
}
