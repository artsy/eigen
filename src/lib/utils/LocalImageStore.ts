import AsyncStorage from "@react-native-community/async-storage"
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

export const storeLocalImage = (image: LocalImage, key: string): Promise<void> => {
  const expirationDate = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
  const imageToStore: StoredImage = {
    expirationDate,
    path: image.path,
    height: image.height,
    width: image.width,
  }
  const serializedImage = JSON.stringify(imageToStore)
  return AsyncStorage.setItem(key, serializedImage)
}

export const deleteLocalImage = (key: string): Promise<void> => {
  return AsyncStorage.removeItem(key)
}

export const retrieveLocalImage = async (key: string, currentTime: number = Date.now()): Promise<LocalImage | null> => {
  return new Promise(async (resolve) => {
    const imageJSON = await AsyncStorage.getItem(key)

    if (!imageJSON) {
      resolve(null)
      return
    }

    const image = JSON.parse(imageJSON)
    if (!image) {
      resolve(null)
      return
    }

    if ("expirationDate" in image && "path" in image && "height" in image && "width" in image) {
      const expirationDate = DateTime.fromISO(image.expirationDate).toMillis()
      const currentDate = currentTime ? currentTime : Date.now()
      if (currentDate > expirationDate) {
        resolve(null)
      }

      const width = parseInt(image.width, 10)
      const height = parseInt(image.height, 10)

      resolve({
        path: image.path,
        width,
        height,
      })
    } else {
      resolve(null)
    }
  })
}
