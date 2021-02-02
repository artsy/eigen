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
