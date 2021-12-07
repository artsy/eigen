import AsyncStorage from "@react-native-community/async-storage"
import { DateTime } from "luxon"

export const expirationKeyPostfix = "EXPIRATION_TIME"
export const widthKeyPostfix = "WIDTH"
export const heightKeyPostfix = "HEIGHT"
export interface LocalImage {
  path: string
  width: number
  height: number
}

export const storeLocalImage = (image: LocalImage, key: string): Promise<void> => {
  const expirationDate = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
  return AsyncStorage.multiSet([
    [key, image.path],
    [metadataKey(key, expirationKeyPostfix), expirationDate],
    [metadataKey(key, heightKeyPostfix), image.height.toString()],
    [metadataKey(key, widthKeyPostfix), image.width.toString()],
  ])
}

export const metadataKey = (key: string, postfix: string) => {
  return key + "_" + postfix
}

export const retrieveLocalImage = async (key: string, currentTime: number = Date.now()): Promise<LocalImage | null> => {
  return new Promise(async (resolve) => {
    const [imagePathArr, expirationTimeArr, heightArr, widthArr] = await AsyncStorage.multiGet([
      key,
      metadataKey(key, expirationKeyPostfix),
      metadataKey(key, heightKeyPostfix),
      metadataKey(key, widthKeyPostfix),
    ])
    if (
      !imagePathArr ||
      !expirationTimeArr ||
      !heightArr ||
      !widthArr ||
      imagePathArr.length < 1 ||
      expirationTimeArr.length < 1 ||
      heightArr.length < 1 ||
      widthArr.length < 1
    ) {
      resolve(null)
    }
    const path = imagePathArr[1]
    const expirationTime = expirationTimeArr[1]
    const widthStr = widthArr[1]
    const heightStr = heightArr[1]

    if (!path || !expirationTime || !widthStr || !heightStr) {
      resolve(null)
    }

    const expirationDate = DateTime.fromISO(expirationTime!).toMillis()
    const currentDate = currentTime ? currentTime : Date.now()

    if (currentDate > expirationDate) {
      resolve(null)
    }

    const width = parseInt(widthStr!, 10)
    const height = parseInt(heightStr!, 10)

    resolve({
      path: path!,
      width,
      height,
    })
  })
}
