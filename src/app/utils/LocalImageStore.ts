import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useMemo, useState } from "react"

// Expiration time is 5 minutes
// TODO: Decrease number
const EXPIRATION_TIME = 5 * 60 * 1000
const IMAGE_KEY_PREFIX = "IMAGES"
const DEFAULT_IMAGE_VERSION = "large"

export interface LocalImage {
  path: string
  width: number
  height: number
  aspectRatio?: number
  expires?: string
}

export const storeLocalImage = async (key: string, image: LocalImage) => {
  console.log("asdf", "storeLocalImage", key, image)

  const expires = new Date().getTime() + EXPIRATION_TIME
  const storeKey = `${IMAGE_KEY_PREFIX}_${key}`

  const serializedImages = prepareImage(image, expires.toString())

  return AsyncStorage.setItem(storeKey, serializedImages)
}

export const getLocalImage = async (key: string): Promise<LocalImage | null> => {
  const storeKey = `${IMAGE_KEY_PREFIX}_${key}`
  const imageJSONString = await AsyncStorage.getItem(storeKey)
  console.log("asdf", "getLocalImage", key, imageJSONString)

  if (!imageJSONString) return null

  return JSON.parse(imageJSONString as string)
}

const prepareImage = (image: LocalImage, expires: string) => {
  const imageToStore: LocalImage = {
    expires,
    path: image.path,
    height: image.height,
    width: image.width,
    aspectRatio: image.width / (image.height || 1),
  }

  return JSON.stringify(imageToStore)
}

export const deleteLocalImages = (key: string): Promise<void> => {
  return AsyncStorage.removeItem(key)
}

export const useLocalImages = (
  images: ({ internalID: string | null; versions?: any } | null | undefined)[] | null | undefined,
  requestedImageVersion?: string,
  refreshKey?: any
) => {
  if (!images) return []

  return useLocalImagesStorage(
    images?.map((image) => ({ key: image?.internalID, imageVersions: image?.versions })),
    requestedImageVersion,
    refreshKey
  )
}
/**
 * Returns the local image if it is stored and the requested image version is not available
 */
export const useLocalImage = (
  image: { internalID: string | null; versions?: any } | null | undefined,
  requestedImageVersion?: string
) => {
  return useLocalImageStorage(image?.internalID, image?.versions, requestedImageVersion)
}

/**
 * Returns the local image for a given key if it is stored and if the requested image version is not available
 */
export const useLocalImageStorage = (
  key: string | null | undefined,
  imageVersions?: any,
  requestedImageVersion?: string
) => {
  return useLocalImagesStorage([{ key, imageVersions }], requestedImageVersion)[0]
}

export const useLocalImagesStorage = (
  images: { key: string | null | undefined; imageVersions?: any }[],
  requestedImageVersion?: string,
  refreshKey?: any
) => {
  const [localImages, setLocalImages] = useState<(LocalImage | null)[]>([])

  const changeLocalImages = async () => {
    try {
      const allImages = await Promise.all(
        images.map((image) => {
          const isImageAvailable =
            image.imageVersions &&
            isImageVersionAvailable(
              image.imageVersions,
              requestedImageVersion || DEFAULT_IMAGE_VERSION
            )

          if (isImageAvailable || !image.key) return null

          return getLocalImage(image.key!)
        })
      )

      setLocalImages(allImages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log("result1", "YEAH")
    changeLocalImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  return localImages
}

export const isImageVersionAvailable = (versions: any[], version: string) =>
  !!versions?.includes(version)
