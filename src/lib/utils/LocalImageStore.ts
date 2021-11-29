import AsyncStorage from "@react-native-community/async-storage"
import { DateTime } from "luxon"

const expirationKeyPostfix = "EXPIRATION_TIME"

export const storeLocalImage = (imagePath: string, key: string): Promise<void> => {
  const expirationDate = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
  return AsyncStorage.multiSet([
    [key, imagePath],
    [expirationKey(key), expirationDate],
  ])
}

export const expirationKey = (key: string) => {
  return key + "_" + expirationKeyPostfix
}

export const retrieveLocalImage = async (key: string, currentTime: number = Date.now()): Promise<string | null> => {
  return new Promise(async (resolve) => {
    const [imagePathArr, expirationTimeArr] = await AsyncStorage.multiGet([key, expirationKey(key)])
    if (!imagePathArr || !expirationTimeArr || imagePathArr.length < 1 || expirationTimeArr.length < 1) {
      resolve(null)
    }
    const imagePath = imagePathArr[1]
    const expirationTime = expirationTimeArr[1]

    if (!imagePath || !expirationTime) {
      resolve(null)
    }

    const expirationDate = DateTime.fromISO(expirationTime!).toMillis()
    const currentDate = currentTime ? currentTime : Date.now()

    if (currentDate > expirationDate) {
      resolve(null)
    }

    resolve(imagePath)
  })
}
