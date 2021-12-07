import { myCollectionAddArtworkMutationResponse } from "__generated__/myCollectionAddArtworkMutation.graphql"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { getConvertedImageUrlFromS3 } from "lib/utils/getConvertedImageUrlFromS3"
import { LocalImage, storeLocalImage } from "lib/utils/LocalImageStore"
import { ArtworkFormValues, Image } from "../../State/MyCollectionArtworkModel"

export const myCollectionLocalPhotoKey = (slug: string, index: number) => {
  return slug + "_" + index
}

export const storeLocalPhotos = (response: myCollectionAddArtworkMutationResponse, photos: Image[]) => {
  const slug = response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node?.slug
  if (slug) {
    photos.forEach((photo, index) => {
      if (photo.path && photo.height && photo.width) {
        const key = myCollectionLocalPhotoKey(slug, index)
        const image: LocalImage = {
          path: photo.path,
          width: photo.width,
          height: photo.height,
        }
        storeLocalImage(image, key)
      }
    })
  }
}

/**
 * Upload photos to s3 bucket
 * used to pass the s3 urls on artwork upload for processing by Gemini
 * @param photos
 * @returns urls of the uploaded images
 */
export const uploadPhotos = async (photos: ArtworkFormValues["photos"]) => {
  // only recently added photos have a path
  const imagePaths: string[] = photos.map((photo) => photo.path).filter((path): path is string => path !== undefined)
  const externalImageUrls: string[] = []

  for (const path of imagePaths) {
    const url = await getConvertedImageUrlFromS3(path)
    externalImageUrls.push(url)
  }
  return externalImageUrls
}

/**
 * Determine if a returned image object is still being processed by Gemini
 * Gemini returns an array of image versions which will be populated with
 * more versions as processing completes
 * @param image
 * @param soughtVersion
 * @returns boolean, whether the soughtVersion is done processing
 */
export const imageIsProcessing = (image: Image | null, soughtVersion: string) => {
  if (!image) {
    return false
  }

  const isProcessing = !image.imageVersions?.includes(soughtVersion)
  return isProcessing
}

export const isImage = (toCheck: any): toCheck is Image => !!toCheck

export const hasImagesStillProcessing = (
  mainImage: any,
  imagesToCheck: MyCollectionArtworkHeader_artwork["images"]
) => {
  if (!isImage(mainImage) || imageIsProcessing(mainImage, "normalized")) {
    return true
  }

  if (!imagesToCheck) {
    return false
  }

  const concreteImages = imagesToCheck as Image[]
  const stillProcessing = concreteImages.some((image) => imageIsProcessing(image, "normalized"))
  return stillProcessing
}
