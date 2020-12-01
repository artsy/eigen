import { NativeModules, Platform } from "react-native"
import ImagePicker from "react-native-image-crop-picker"
import { osMajorVersion } from "./hardware"

export async function requestPhotos() {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    console.log("Requested photos on iOS 14")
    NativeModules.ARTemporaryAPIModule.requestPhotos((error, result) => {
      if (error) {
        console.log("Error requesting photos")
      } else {
        console.log("Successfully got photos", result)
        return result
      }
    })
    return null
  } else {
    console.log("Requested photos on another OS or lower version")
    const photos = await ImagePicker.openPicker({
      multiple: true,
    })
    return photos
  }
}
