import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

// Expiration time is 10 minutes
const EXPIRATION_TIME = 10 * 60 * 1000
const IMAGE_KEY_PREFIX = "IMAGES"
const DEFAULT_IMAGE_VERSION = "large"

export interface LocalImage {
  path: string
  width?: number
  height?: number
  aspectRatio?: number
  expires?: string
}

export const storeLocalImage = async (key: string, image: LocalImage) => {
  const expires = new Date().getTime() + EXPIRATION_TIME
  const storeKey = `${IMAGE_KEY_PREFIX}_${key}`

  const serializedImages = prepareImage(image, expires.toString())

  return AsyncStorage.setItem(storeKey, serializedImages)
}

export const getLocalImage = async (key: string): Promise<LocalImage | null> => {
  const storeKey = `${IMAGE_KEY_PREFIX}_${key}`
  const imageJSONString = await AsyncStorage.getItem(storeKey)

  if (!imageJSONString) return null

  return JSON.parse(imageJSONString as string)
}

// Clean all images that have been expired
export const cleanLocalImages = async () => {
  const keys = await AsyncStorage.getAllKeys()

  const imageKeys = keys.filter((key) => key.startsWith(IMAGE_KEY_PREFIX))

  imageKeys.forEach(async (key) => {
    const item = JSON.parse((await AsyncStorage.getItem(key)) || "{}")

    if (!item?.expires || +item?.expires > new Date().getTime()) {
      return
    }

    AsyncStorage.removeItem(key)
  })
}

/**
 * Returns the local image if it is stored and the requested image version is not available
 */
export const useLocalImage = (
  image: { internalID: string | null | undefined; versions?: any } | null | undefined,
  requestedImageVersion?: string
) => {
  return useLocalImageStorage(image?.internalID, image?.versions, requestedImageVersion)
}

/**
 * Returns local images if they are stored and the requested image version is not available
 */
export const useLocalImages = (
  images:
    | ({ internalID: string | null | undefined; versions?: any } | null | undefined)[]
    | null
    | undefined,
  requestedImageVersion?: string,
  refreshKey?: any
) => {
  return useLocalImagesStorage(
    images?.map((image) => ({ key: image?.internalID, imageVersions: image?.versions })) || [],
    requestedImageVersion,
    refreshKey
  )
}

/**
 * Returns the local image for a given key if it is stored and if the requested image version is not available
 */
export const useLocalImageStorage = (
  key: string | null | undefined,
  imageVersions?: any,
  requestedImageVersion?: string,
  refreshKey?: any
) => {
  return useLocalImagesStorage([{ key, imageVersions }], requestedImageVersion, refreshKey)[0]
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

          return getLocalImage(image.key)
        })
      )

      setLocalImages(allImages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    changeLocalImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.map((image) => image.key).join(""), refreshKey])

  return localImages
}

const isImageVersionAvailable = (versions: any[], version: string) => !!versions?.includes(version)

const prepareImage = (image: LocalImage, expires: string) => {
  const imageToStore: LocalImage = {
    expires,
    path: image.path,
    height: image.height,
    width: image.width,
    aspectRatio: (image.width || 1) / (image.height || 1),
  }

  return JSON.stringify(imageToStore)
}
