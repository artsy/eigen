import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import RNDocumentPicker, { DocumentPickerResponse } from "@react-native-documents/picker"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { isArray } from "lodash"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./platformUtil"

export async function requestPhotos(allowMultiple = true): Promise<Image[]> {
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

export async function showDocumentsAndPhotosActionSheet(
  showActionSheet: (options: ActionSheetOptions, callback: (i?: number) => void) => void,
  useModal = false,
  allowMultiple = true
): Promise<Image[] | DocumentPickerResponse[]> {
  return new Promise((resolve, reject) => {
    showActionSheet(
      {
        options: ["Documents", "Photo Library", "Take Photo", "Cancel"],
        cancelButtonIndex: 3,
        useModal,
      },
      async (buttonIndex) => {
        let photos = null
        try {
          if (buttonIndex === 0) {
            const results = await RNDocumentPicker.pick({
              mode: "import",
              type: [
                RNDocumentPicker.types.images,
                RNDocumentPicker.types.pdf,
                RNDocumentPicker.types.docx,
                RNDocumentPicker.types.doc,
              ],
              allowMultiSelection: true,
            })

            resolve(results)
          }
          if (buttonIndex === 1) {
            photos = await requestPhotos(allowMultiple)
            resolve(photos)
          }
          if (buttonIndex === 2) {
            if (Platform.OS === "android") {
              // We attempt to clear the cache due to an ImagePicker bug
              // See Hacks.md for more.
              // We don't restrict users from proceeding even if clearCache resolves to false
              await ArtsyNativeModule.clearCache()
            }
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

export const isImage = (type: Image | DocumentPickerResponse): type is Image => {
  return !!(type as Image).height && !!(type as Image).width
}

export const isDocument = (
  type: Image | DocumentPickerResponse
): type is DocumentPickerResponse => {
  return !!(type as DocumentPickerResponse).uri
}
