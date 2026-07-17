import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { isArray } from "lodash"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./platformUtil"

interface RequestPhotosOptions {
  /**
   * Let the user crop each selected image (free-form) before it's returned.
   * Intended for single selection (`allowMultiple = false`).
   */
  cropping?: boolean
}

export async function requestPhotos(
  allowMultiple = true,
  { cropping = false }: RequestPhotosOptions = {}
): Promise<Image[]> {
  // The native iOS picker can't crop, and presenting a cropper after it dismisses is unreliable.
  // So when cropping is requested we use image-crop-picker's openPicker, which does pick + crop
  // in a single native flow. Cropping implies single selection.
  if (cropping) {
    const image = await ImagePicker.openPicker({
      mediaType: "photo",
      multiple: false,
      cropping: true,
      freeStyleCropEnabled: true,
    })
    return isArray(image) ? image : [image]
  }

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
  showActionSheet: (options: ActionSheetOptions, callback: (i?: number) => void) => void,
  useModal = false,
  allowMultiple = true
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
