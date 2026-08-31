import { LENS_VIEWFINDER_ASPECT_RATIO, LENS_VIEWFINDER_FRACTION } from "app/Scenes/Lens/constants"

export interface ViewfinderRect {
  originX: number
  originY: number
  width: number
  height: number
}

/**
 * How the photo was presented within the container the brackets were drawn over -- which decides
 * whether the `cover` mapping has to be inverted through a 90-degree rotation.
 *
 * - `"cover"`: the photo's pixels were scaled to cover the container as-is, without rotation.
 *   React Native's `<Image resizeMode="cover">` never rotates, so the analyzing screen's preview
 *   card (the library-pick path) is always this.
 * - `"coverRotatedToContainer"`: the photo's pixels were rotated to align with the container's
 *   orientation before covering it. The live camera preview does this -- it aligns the sensor feed
 *   to the *interface*, which is orientation-locked, so holding the phone sideways rotates the
 *   world within the preview rather than rotating the UI.
 *
 * Only matters when the photo's and the container's orientations disagree.
 */
export type PhotoPresentation = "cover" | "coverRotatedToContainer"

/**
 * Shared by `LensCornerBrackets` (container = the screen, or the analyzing screen's preview card)
 * and `cropToViewfinder.ts` (container = the photo's own pixels), so the drawn rect and the cropped
 * rect can't drift apart -- same math, different container.
 */
export function computeViewfinderRect(
  containerWidth: number,
  containerHeight: number
): ViewfinderRect {
  const containerAspectRatio = containerWidth / containerHeight

  const [containWidth, containHeight] =
    containerAspectRatio > LENS_VIEWFINDER_ASPECT_RATIO
      ? [containerHeight * LENS_VIEWFINDER_ASPECT_RATIO, containerHeight]
      : [containerWidth, containerWidth / LENS_VIEWFINDER_ASPECT_RATIO]

  const width = containWidth * LENS_VIEWFINDER_FRACTION
  const height = containHeight * LENS_VIEWFINDER_FRACTION

  return {
    originX: (containerWidth - width) / 2,
    originY: (containerHeight - height) / 2,
    width,
    height,
  }
}

/**
 * The rect, in the PHOTO's own pixel space, matching the bracket rect drawn over a container the
 * photo is displayed within via `cover`. Assumes photo and container are both centered.
 *
 * NOT the same as `computeViewfinderRect(photoWidth, photoHeight)`: that treats the photo's raw
 * canvas as the container, which only coincides with what's inside the brackets when the
 * container's ratio equals `LENS_VIEWFINDER_ASPECT_RATIO` -- true for the analyzing screen's card,
 * badly false for the full-screen capture. Inverting the real `cover` mapping is correct for any
 * container ratio.
 *
 * `presentation` corrects a 90-degree rotation between the photo's space and the space it was
 * framed in: a capture follows the device, the preview follows the orientation-locked interface, so
 * a sideways capture leaves them a quarter turn apart and a plain inversion returns a transposed
 * rect. The rotation's *direction* doesn't matter -- everything involved is centered, so 90 and 270
 * give the same rect, which is why two orientations suffice and `photo.orientation` isn't needed.
 */
export function computePhotoCropRect(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number,
  presentation: PhotoPresentation = "cover"
): ViewfinderRect {
  const containerIsPortrait = containerHeight >= containerWidth
  const photoIsPortrait = photoHeight >= photoWidth
  const isRotated =
    presentation === "coverRotatedToContainer" && containerIsPortrait !== photoIsPortrait

  // Invert the cover mapping in the space the photo was actually *presented* in -- for a rotated
  // presentation that's the photo's own dimensions transposed.
  const [presentedWidth, presentedHeight] = isRotated
    ? [photoHeight, photoWidth]
    : [photoWidth, photoHeight]

  const bracketRect = computeViewfinderRect(containerWidth, containerHeight)

  const coverScale = Math.max(containerWidth / presentedWidth, containerHeight / presentedHeight)
  const photoOffsetX = (containerWidth - presentedWidth * coverScale) / 2
  const photoOffsetY = (containerHeight - presentedHeight * coverScale) / 2

  const rect = {
    originX: (bracketRect.originX - photoOffsetX) / coverScale,
    originY: (bracketRect.originY - photoOffsetY) / coverScale,
    width: bracketRect.width / coverScale,
    height: bracketRect.height / coverScale,
  }

  if (!isRotated) {
    return rect
  }

  // Rotate the rect back out of the presented space into the photo's own space. A transpose is
  // sufficient because everything involved is centered -- see the docstring.
  return {
    originX: rect.originY,
    originY: rect.originX,
    width: rect.height,
    height: rect.width,
  }
}
