import { Platform } from "react-native"
import ImagePicker from "react-native-image-crop-picker"
import { osMajorVersion } from "./hardware"

export async function requestPhotos() {
  let photos = null
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    console.log("Requested photos on iOS 14")
    return null
  } else {
    console.log("Requested photos on another OS or lower version")
    photos = await ImagePicker.openPicker({
      multiple: true,
    })
    return photos
  }
}
