import { LENS_VIEWFINDER_ASPECT_RATIO, LENS_VIEWFINDER_FRACTION } from "app/Scenes/Lens/constants"

export interface ViewfinderRect {
  originX: number
  originY: number
  width: number
  height: number
}

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
export function computeViewfinderRect(containerWidth: number, containerHeight: number): ViewfinderRect {
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
 */
export function computePhotoCropRect(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number
): ViewfinderRect {
  const bracketRect = computeViewfinderRect(containerWidth, containerHeight)

  const coverScale = Math.max(containerWidth / photoWidth, containerHeight / photoHeight)
  const photoOffsetX = (containerWidth - photoWidth * coverScale) / 2
  const photoOffsetY = (containerHeight - photoHeight * coverScale) / 2

  return {
    originX: (bracketRect.originX - photoOffsetX) / coverScale,
    originY: (bracketRect.originY - photoOffsetY) / coverScale,
    width: bracketRect.width / coverScale,
    height: bracketRect.height / coverScale,
  }
}
