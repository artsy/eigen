import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateTime } from "luxon"
export interface LocalImage {
  path: string
  width: number
  height: number
}

interface Expirable {
  expirationDate: string
}

type StoredImage = LocalImage & Expirable

export const storeLocalImages = (images: LocalImage[], rootKey: string): Promise<void> => {
  const expirationDate = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
  const imagesToStore: StoredImage[] = []
  for (const image of images) {
    const imageToStore: StoredImage = {
      expirationDate,
      path: image.path,
      height: image.height,
      width: image.width,
    }
    imagesToStore.push(imageToStore)
  }
  const serializedImages = JSON.stringify(imagesToStore)
  return AsyncStorage.setItem(rootKey, serializedImages)
}

export const deleteLocalImages = (key: string): Promise<void> => {
  return AsyncStorage.removeItem(key)
}

export const retrieveLocalImages = async (
  key: string,
  currentTime: number = Date.now()
): Promise<LocalImage[] | null> => {
  return new Promise(async (resolve) => {
    const imagesJSON = await AsyncStorage.getItem(key)

    if (!imagesJSON) {
      resolve(null)
      return
    }

    const images = JSON.parse(imagesJSON)

    if (!images) {
      resolve(null)
      return
    }

    if (!Array.isArray(images)) {
      resolve(null)
      return
    }

    const resolvedImages: LocalImage[] = []
    for (const image of images) {
      if ("expirationDate" in image && "path" in image && "height" in image && "width" in image) {
        const expirationDate = DateTime.fromISO(image.expirationDate).toMillis()
        const currentDate = currentTime ? currentTime : Date.now()
        if (currentDate > expirationDate) {
          break
        }
        const width = parseInt(image.width, 10)
        const height = parseInt(image.height, 10)

        resolvedImages.push({
          path: image.path,
          width,
          height,
        })
      } else {
        break
      }
    }

    if (resolvedImages.length === 0) {
      resolve(null)
    }

    resolve(resolvedImages)
  })
}
