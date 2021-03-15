import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./hardware"

export async function requestPhotos(): Promise<Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    return LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos()
  } else {
    return ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
    })
  }
}

export async function showPhotoActionSheet(
  showActionSheet: (options: ActionSheetOptions, callback: (i: number) => void) => void
): Promise<Image[]> {
  return new Promise<Image[]>((resolve, reject) => {
    showActionSheet(
      {
        options: ["Photo Library", "Take Photo", "Cancel"],
        cancelButtonIndex: 2,
      },
      async (buttonIndex) => {
        let photos = null
        try {
          if (buttonIndex === 0) {
            photos = await requestPhotos()
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
