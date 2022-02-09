import { transformBytesToSize } from "lib/utils/transformBytesToSize"
import { Photo } from "../validation"

export const calculatePhotoSize = (photo: Photo): Photo => {
  if (!photo.size) {
    photo.error = true
    photo.sizeDisplayValue = "Size not found"
    return photo
  }

  if (photo.size > 30000000) {
    photo.error = true
    photo.errorMsg = "Photo is bigger than 30 MB"
    return photo
  }

  photo.sizeDisplayValue = transformBytesToSize(photo.size)
  return photo
}
