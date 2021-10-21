import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./platformUtil"

export async function requestPhotos<T extends boolean>(multiple: T): Promise<T extends true ? Image[] : Image>

export async function requestPhotos(multiple: undefined): Promise<Image[]>

export async function requestPhotos(multiple?: boolean | undefined): Promise<Image | Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    return LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos()
  } else {
    return ImagePicker.openPicker({
      mediaType: "photo",
      multiple: multiple ?? true,
    })
  }
}

type ShowActionSheet = (options: ActionSheetOptions, callback: (i: number) => void) => void

export async function showPhotoActionSheet<T extends boolean>(
  showActionSheet: ShowActionSheet,
  allowMultipleSelection?: T
): Promise<T extends true ? Image[] : Image>

export async function showPhotoActionSheet(
  showActionSheet: ShowActionSheet,
  allowMultipleSelection: undefined
): Promise<Image[]>

export async function showPhotoActionSheet(
  showActionSheet: (options: ActionSheetOptions, callback: (i: number) => void) => void,
  useModal: boolean = false,
  allowMultipleSelection?: boolean
): Promise<Image[]> {
  return new Promise<Image[]>((resolve, reject) => {
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
            photos = await requestPhotos(allowMultipleSelection !== undefined ? allowMultipleSelection : true)
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
