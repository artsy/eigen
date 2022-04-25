import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { transformBytesToSize } from "app/utils/transformBytesToSize"

const totalSizeLimitInBytes = 30000000

// calculates a photos size from Bytes to unit and return updated photo
export const calculateSinglePhotoSize = (photo: Photo): Photo => {
  if (photo.automaticallyAdded) {
    photo.sizeDisplayValue = "Automatically added"
    return photo
  }

  if (!photo.size) {
    photo.error = true
    photo.sizeDisplayValue = "Size not found"
    return photo
  }

  photo.sizeDisplayValue = transformBytesToSize(photo.size)
  return photo
}

// calculates all photos' size and returns if total size exceeds limit
export const isSizeLimitExceeded = (photos: Photo[]): boolean => {
  const allPhotosSize = photos.reduce((acc: number, cv: Photo) => {
    acc = acc + (cv?.size || 0)
    return acc
  }, 0)

  return allPhotosSize > totalSizeLimitInBytes
}
