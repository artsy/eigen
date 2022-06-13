import { MyCollectionArtworkHeader_artwork$data } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { getMeasurements, Size } from "app/Scenes/Artwork/Components/ImageCarousel/geometry"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { deleteLocalImages, LocalImage, storeLocalImages } from "app/utils/LocalImageStore"
import { ScreenDimensionsWithSafeAreas } from "shared/hooks"
import { ArtworkFormValues, Image } from "../../State/MyCollectionArtworkModel"

export const storeLocalPhotos = (slug: string, photos: Image[]) => {
  const localImages: LocalImage[] = []
  photos.forEach((photo, _) => {
    if (photo.path && photo.height && photo.width) {
      const image: LocalImage = {
        path: photo.path,
        width: photo.width,
        height: photo.height,
      }
      localImages.push(image)
    }
  })
  storeLocalImages(localImages, slug)
}

export const removeLocalPhotos = (slug: string) => {
  deleteLocalImages(slug)
}

/**
 * Upload photos to s3 bucket
 * used to pass the s3 urls on artwork upload for processing by Gemini
 * @param photos
 * @returns urls of the uploaded images
 */
export const uploadPhotos = async (photos: ArtworkFormValues["photos"]) => {
  // only recently added photos have a path
  const imagePaths: string[] = photos
    .map((photo) => photo.path)
    .filter((path): path is string => path !== undefined)
  const externalImageUrls: string[] = []

  for (const path of imagePaths) {
    const url = await getConvertedImageUrlFromS3(path)
    if (!url) {
      console.error(`Could not get converted image url for ${path}`)
      continue
    }
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
  imagesToCheck: MyCollectionArtworkHeader_artwork$data["images"]
) => {
  if (!isImage(mainImage) || imageIsProcessing(mainImage, "normalized")) {
    return true
  }

  if (!imagesToCheck) {
    return false
  }

  const concreteImages = imagesToCheck as unknown as Array<Omit<Image, " $fragmentRefs">> as Image[]
  const stillProcessing = concreteImages.some((image) => imageIsProcessing(image, "normalized"))
  return stillProcessing
}

export const getBoundingBox = (
  imageSize: Size,
  maxImageHeight: number,
  screenDimensions: ScreenDimensionsWithSafeAreas
): Size => {
  const imageHeight = imageSize.height ?? 0
  return {
    height: imageHeight < maxImageHeight ? imageHeight : maxImageHeight,
    width: screenDimensions.width,
  }
}

export const getImageMeasurements = (imageSize: Size, boundingBox: Size) => {
  const measurements = getMeasurements({
    images: [
      {
        height: imageSize.height,
        width: imageSize.width,
      },
    ],
    boundingBox,
  })[0]
  return measurements
}
