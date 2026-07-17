import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { isArray } from "lodash"
import { InteractionManager, Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./platformUtil"

interface RequestPhotosOptions {
  /**
   * Let the user crop each selected image (free-form) before it's returned.
   * Intended for single selection (`allowMultiple = false`).
   */
  cropping?: boolean
}

const cropImage = (path: string): Promise<Image> =>
  // Wait for the picker to finish dismissing before presenting the cropper — presenting it
  // while the picker is still on screen makes the cropper silently fail to appear.
  new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve(undefined))
  }).then(() =>
    ImagePicker.openCropper({
      path,
      mediaType: "photo",
      freeStyleCropEnabled: true,
    })
  )

export async function requestPhotos(
  allowMultiple = true,
  { cropping = false }: RequestPhotosOptions = {}
): Promise<Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    // Keeps the native grid picker (opens straight to photos, not the albums list).
    const images: Image[] =
      await LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos(allowMultiple)

    if (!cropping) {
      return images
    }

    // The native picker has no crop step, so crop each selected image afterwards.
    return Promise.all(images.map((image) => cropImage(image.path)))
  } else {
    const images = await ImagePicker.openPicker({
      mediaType: "photo",
      multiple: allowMultiple,
      ...(cropping ? { cropping: true, freeStyleCropEnabled: true } : {}),
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
