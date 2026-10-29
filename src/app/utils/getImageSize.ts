import { Image } from "react-native"

/**
 * Promise wrapper around `Image.getSize`, which reports display-space dimensions: unlike sizes
 * reported by pickers or the camera, they already account for EXIF orientation.
 */
export function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    )
  })
}
