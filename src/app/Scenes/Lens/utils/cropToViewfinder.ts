import { computePhotoCropRect, PhotoPresentation } from "app/Scenes/Lens/utils/viewfinderGeometry"
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import { Image } from "react-native"

const JPEG_COMPRESS_QUALITY = 0.9

/**
 * The dimensions come back alongside the uri because the crop's aspect ratio is NOT fixed: a
 * sideways capture is transposed (see `PhotoPresentation`), so callers laying out a container
 * around the result can't assume `LENS_VIEWFINDER_ASPECT_RATIO`.
 */
export interface CroppedPhoto {
  uri: string
  width: number
  height: number
}

/**
 * Crops the photo to exactly the area the corner brackets marked -- see `computePhotoCropRect` for
 * the geometry and `PhotoPresentation` for what `presentation` selects.
 *
 * `containerWidth`/`containerHeight` MUST be the dimensions of whatever the user actually saw the
 * brackets drawn against for this photo -- see the call site in `LensAnalyzing.tsx`.
 *
 * Uses `Image.getSize()` rather than vision-camera's reported `photo.width`/`photo.height`: those
 * are raw sensor-buffer dimensions with orientation applied lazily via EXIF flags, so they don't
 * reliably match the photo's display-space dimensions.
 */
export async function cropToViewfinder(
  uri: string,
  containerWidth: number,
  containerHeight: number,
  presentation: PhotoPresentation = "cover"
): Promise<CroppedPhoto> {
  const { width, height } = await getImageSize(uri)
  const rect = computeViewfinderCropRect(
    width,
    height,
    containerWidth,
    containerHeight,
    presentation
  )

  const context = ImageManipulator.manipulate(uri)
  const result = await (
    await context.crop(rect).renderAsync()
  ).saveAsync({
    compress: JPEG_COMPRESS_QUALITY,
    format: SaveFormat.JPEG,
  })

  return { uri: result.uri, width: result.width, height: result.height }
}

/**
 * Rounded because the Android transformer truncates to `Int`, and fractional `CGRect` bounds aren't
 * useful on iOS. Separate from `cropToViewfinder` so the geometry is testable without a device.
 */
export function computeViewfinderCropRect(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  presentation: PhotoPresentation = "cover"
): { originX: number; originY: number; width: number; height: number } {
  const rect = computePhotoCropRect(
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
    presentation
  )

  return {
    originX: Math.round(rect.originX),
    originY: Math.round(rect.originY),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  }
}

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    )
  })
}
