/**
 * Target width/height ratio for the viewfinder rect. A fixed constant, not derived from the
 * phone's own screen ratio -- mirroring the actual screen (~9:19.5 on most phones) was tried and
 * looked bad in practice: a viewfinder that tall and narrow isn't a usable framing shape. 5:6
 * matches the capture-frame box in the Figma prototype reviewed at the 2026-08-17 kickoff -- a
 * deliberate middle ground between a full square (too tight/artificial) and the phone's native
 * ratio (too elongated), not an arbitrary number.
 */
export const LENS_VIEWFINDER_ASPECT_RATIO = 5 / 6

/**
 * Fraction of the largest `LENS_VIEWFINDER_ASPECT_RATIO`-shaped rect that fits within a given
 * container (screen or photo) that the viewfinder actually occupies -- i.e. how much smaller than
 * a full "contain" fit it is. This is the "tightening" knob; `LENS_VIEWFINDER_ASPECT_RATIO` is the
 * "shape" knob -- they're independent. See `utils/viewfinderGeometry.ts` for the shared rect math
 * used by both `LensCornerBrackets` (what's drawn, on the live capture screen and, scaled down, on
 * the analyzing screen's preview card) and `utils/cropToViewfinder.ts` (what's actually cropped and
 * sent to search) -- change this one constant, not two, so they can't drift apart. The crop uses
 * `expo-image-manipulator`'s real sub-rect crop (verified against its native source, see that
 * file's header comment) -- an earlier attempt with `@bam.tech/react-native-image-resizer` was
 * reverted after turning out to only scale, never crop.
 */
export const LENS_VIEWFINDER_FRACTION = 0.78
