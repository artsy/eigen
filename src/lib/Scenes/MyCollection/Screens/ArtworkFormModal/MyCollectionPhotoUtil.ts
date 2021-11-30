import { myCollectionAddArtworkMutationResponse } from "__generated__/myCollectionAddArtworkMutation.graphql"
import { getConvertedImageUrlFromS3 } from "lib/utils/getConvertedImageUrlFromS3"
import { storeLocalImage } from "lib/utils/LocalImageStore"
import { ArtworkFormValues, Image } from "../../State/MyCollectionArtworkModel"

export function myCollectionLocalPhotoKey(slug: string, index: number) {
  return slug + "_" + index
}

export function storeLocalPhotos(response: myCollectionAddArtworkMutationResponse, photos: Image[]) {
  const slug = response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node?.slug
  if (slug) {
    photos.forEach((photo, index) => {
      if (photo.path) {
        const key = myCollectionLocalPhotoKey(slug, index)
        storeLocalImage(photo.path, key)
      }
    })
  }
}

export async function uploadPhotos(photos: ArtworkFormValues["photos"]) {
  // only recently added photos have a path
  const imagePaths: string[] = photos.map((photo) => photo.path).filter((path): path is string => path !== undefined)
  const externalImageUrls: string[] = []

  for (const path of imagePaths) {
    const url = await getConvertedImageUrlFromS3(path)
    externalImageUrls.push(url)
  }

  return externalImageUrls
}
