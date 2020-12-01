import { NativeModules, Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./hardware"

export async function requestPhotos(): Promise<Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    return new Promise((resolve) => {
      NativeModules.ARTemporaryAPIModule.requestPhotos((error, result) => {
        if (error) {
          resolve([])
        } else {
          resolve(result as any) // why?
        }
      })
    })
  } else {
    return ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
    })
  }
}
