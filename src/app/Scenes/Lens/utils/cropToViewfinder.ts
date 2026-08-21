import { computePhotoCropRect } from "app/Scenes/Lens/utils/viewfinderGeometry"
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import { Image } from "react-native"

const JPEG_COMPRESS_QUALITY = 0.9

/**
 * Crops the captured/selected photo to exactly the area the corner brackets marked -- see
 * `computePhotoCropRect` for why this requires inverting the actual `cover` mapping between the
 * photo and whatever container it was displayed within (the full screen for a camera capture, the
 * analyzing screen's preview card for a library pick), rather than independently re-deriving a
 * same-shaped rect against the photo's own raw canvas.
 *
 * `containerWidth`/`containerHeight` MUST be the dimensions of whatever the user actually saw the
 * brackets drawn against for this photo -- see the call site in `LensAnalyzing.tsx`.
 *
 * The crop itself is a real sub-rect extraction, confirmed against expo-image-manipulator's native
 * source before adopting it: iOS's `ImageCropTransformer` calls `image.cgImage?.cropping(to: rect)`
 * with an actual `CGRect`; Android's `CropTransformer` calls
 * `Bitmap.createBitmap(bitmap, rect.originX, rect.originY, rect.width, rect.height)` with real
 * offsets. Unlike the previously-reverted `@bam.tech/react-native-image-resizer` attempt, whose
 * `cover`/`contain` modes only ever proportionally scaled the *whole* image on both platforms and
 * never cropped anything -- see the revert commit for that postmortem.
 *
 * Uses `Image.getSize()` rather than vision-camera's own reported `photo.width`/`photo.height` on
 * purpose -- the latter are raw sensor-buffer dimensions that vision-camera documents as having
 * orientation "applied lazily via EXIF flags," so they don't reliably match the photo's
 * display-space (rotated) dimensions.
 *
 * UNVERIFIED ON A REAL DEVICE: whether EXIF orientation is handled consistently between
 * `Image.getSize()` and expo-image-manipulator's own native decode, and whether the captured
 * photo's true aspect ratio matches the live preview stream's aspect ratio closely enough for the
 * `cover`-inversion assumption to hold exactly (they're configured somewhat independently in
 * vision-camera).
 */
export async function cropToViewfinder(
  uri: string,
  containerWidth: number,
  containerHeight: number
): Promise<string> {
  const { width, height } = await getImageSize(uri)
  const rect = computeViewfinderCropRect(width, height, containerWidth, containerHeight)

  const context = ImageManipulator.manipulate(uri)
  const result = await (await context.crop(rect).renderAsync()).saveAsync({
    compress: JPEG_COMPRESS_QUALITY,
    format: SaveFormat.JPEG,
  })

  return result.uri
}

/**
 * Thin, whole-pixel-rounding wrapper around the shared `computePhotoCropRect` -- pulled out as its
 * own function so the geometry is unit-testable without a device, camera, or native module mock.
 * Rounded because the Android transformer truncates to `Int` and fractional `CGRect` bounds on iOS
 * aren't useful here.
 */
export function computeViewfinderCropRect(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): { originX: number; originY: number; width: number; height: number } {
  const rect = computePhotoCropRect(imageWidth, imageHeight, containerWidth, containerHeight)

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
