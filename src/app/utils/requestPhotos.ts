import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { isArray } from "lodash"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./platformUtil"

export async function requestPhotos(allowMultiple: boolean = true): Promise<Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    return LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos(allowMultiple)
  } else {
    const images = await ImagePicker.openPicker({
      mediaType: "photo",
      multiple: allowMultiple,
    })
    if (isArray(images)) {
      return images
    }
    return [images]
  }
}

export async function showPhotoActionSheet(
  showActionSheet: (options: ActionSheetOptions, callback: (i: number) => void) => void,
  useModal: boolean = false,
  allowMultiple: boolean = true
): Promise<Image[]> {
  return new Promise((resolve, reject) => {
    showActionSheet(
      {
        options: ["Photo Library", "Take Photo", "Cancel"],
        cancelButtonIndex: 2,
        useModal,
      },
      async (buttonIndex) => {
        let photos = null
        try {
          if (buttonIndex === 0) {
            photos = await requestPhotos(allowMultiple)
            resolve(photos)
          }
          if (buttonIndex === 1) {
            const photo = await ImagePicker.openCamera({
              mediaType: "photo",
            })
            photos = [photo]
            resolve(photos)
          }
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}
