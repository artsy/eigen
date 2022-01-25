import { Image } from "../State/MyCollectionArtworkModel"

export function deletedPhotos(initialPhotos: Image[], submittedPhotos: Image[]) {
  let removedPhotos: Array<{ id: string; index: number }> = []
  initialPhotos.forEach((photo, index) => {
    if (photo.internalID) {
      const photoRemoved = !submittedPhotos.some(
        (submittedPhoto) => submittedPhoto.internalID === photo.internalID
      )
      if (photoRemoved) {
        removedPhotos = removedPhotos.concat({
          id: photo.internalID!,
          index,
        })
      }
    }
  })
  return removedPhotos
}
