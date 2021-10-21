import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import ImagePicker, { Image } from "react-native-image-crop-picker"

export async function requestPhotos(): Promise<Image[]> {
  return ImagePicker.openPicker({
    mediaType: "photo",
    multiple: true,
  })
}

export async function showPhotoActionSheet(
  showActionSheet: (options: ActionSheetOptions, callback: (i: number) => void) => void,
  useModal: boolean = false
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
