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
 * The distinction only matters when the photo's and the container's orientations disagree.
 */
export type PhotoPresentation = "cover" | "coverRotatedToContainer"

/**
 * The centered `LENS_VIEWFINDER_ASPECT_RATIO`-shaped rect within a container of the given
 * dimensions, sized to `LENS_VIEWFINDER_FRACTION` of the largest such rect that fits (a "contain"
 * fit -- height-constrained if the container is proportionally wider than the target ratio,
 * width-constrained otherwise).
 *
 * Shared by `LensCornerBrackets` (container = the screen, or the analyzing screen's smaller
 * preview card) and `cropToViewfinder.ts` (container = the captured photo's own pixel dimensions)
 * so the drawn rect and the cropped rect can't drift apart -- same math, different container.
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
 * The rect, in the PHOTO's own pixel space, that corresponds exactly to the `computeViewfinderRect`
 * bracket drawn over a `containerWidth x containerHeight` container the photo is displayed within
 * via `cover` scaling (LensCameraPreview's live preview, full-screen; or LensAnalyzing's preview
 * `<Image resizeMode="cover">`, card-sized).
 *
 * This is NOT the same as just calling `computeViewfinderRect(photoWidth, photoHeight)` directly
 * -- that treats the photo's own raw canvas as the container, which only coincides with what's
 * visually inside the brackets when the container's aspect ratio happens to equal
 * `LENS_VIEWFINDER_ASPECT_RATIO` exactly (true for the analyzing screen's card, by construction --
 * NOT true for the live capture screen, whose full-screen container is a very different, much
 * taller ratio). Concretely: a 0.75-aspect photo viewed through a ~0.46-aspect (typical phone)
 * screen previously produced a crop covering a very different fraction of the photo's width than
 * what the on-screen brackets actually marked -- roughly 78% vs. 48% in one worked example. This
 * function inverts the actual `cover` mapping instead of independently re-deriving a same-shaped
 * rect against the wrong container, so it's always correct regardless of how the container's ratio
 * relates to the photo's.
 *
 * Assumes the photo and the container are both centered, and that the photo is displayed via
 * `cover` (matching `LensCameraPreview`'s pinned `resizeMode="cover"` and `LensAnalyzing`'s
 * `<Image resizeMode="cover">`) -- both true by construction in this scene, but not verified here.
 *
 * `presentation` corrects for a 90-degree rotation between the photo's own space and the space it
 * was presented in. A capture's display space follows the physical device, while the preview it was
 * framed against follows the orientation-locked interface -- so holding the phone sideways leaves
 * the two a quarter turn apart, and a plain `cover` inversion then returns a transposed rect
 * covering roughly half the area the brackets actually marked. Inverting in the presented
 * (transposed) space and rotating the result back is what recovers the framed region.
 *
 * The rotation's *direction* is irrelevant: the bracket rect is centered within the container and
 * the photo is centered within the preview, so 90 and 270 degrees produce the same rect. That's why
 * this needs only the two orientations, not vision-camera's `photo.orientation`.
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
