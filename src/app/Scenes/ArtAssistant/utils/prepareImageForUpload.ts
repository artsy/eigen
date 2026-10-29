import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import { Image } from "react-native"

const MAX_DIMENSION = 2048
const JPEG_COMPRESS_QUALITY = 0.8

/**
 * Re-encodes a picked photo as a JPEG no larger than `MAX_DIMENSION` on its long side.
 * `uploadFileToS3` labels every image `image/jpeg`, so a HEIC from the library would otherwise
 * reach S3 mislabeled, and a full-resolution photo is far more than image search needs.
 */
export async function prepareImageForUpload(uri: string): Promise<string> {
  const { width, height } = await getImageSize(uri)
  const context = ImageManipulator.manipulate(uri)

  if (Math.max(width, height) > MAX_DIMENSION) {
    context.resize(width >= height ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION })
  }

  const result = await (
    await context.renderAsync()
  ).saveAsync({
    compress: JPEG_COMPRESS_QUALITY,
    format: SaveFormat.JPEG,
  })

  return result.uri
}

// `Image.getSize` reports display-space dimensions, unlike the picker's, which can ignore EXIF
// orientation.
function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    )
  })
}
