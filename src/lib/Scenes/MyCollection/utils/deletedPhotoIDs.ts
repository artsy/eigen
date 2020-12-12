import { Image } from "../State/MyCollectionArtworkModel"

export function deletedPhotoIDs(initialPhotos: Image[], submittedPhotos: Image[]) {
  let removedPhotoIDs: string[] = []
  for (const photo of initialPhotos) {
    if (photo.internalID) {
      const photoRemoved = !submittedPhotos.some((submittedPhoto) => submittedPhoto.internalID === photo.internalID)
      if (photoRemoved) {
        removedPhotoIDs = removedPhotoIDs.concat(photo.internalID!)
      }
    }
  }
  return removedPhotoIDs
}
