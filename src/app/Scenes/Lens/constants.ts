/**
 * Fixed on purpose, not derived from the phone's screen ratio: mirroring the screen (~9:19.5) was
 * tried and gives a viewfinder too tall and narrow to frame with.
 */
export const LENS_VIEWFINDER_ASPECT_RATIO = 5 / 6

/**
 * How much smaller than a full "contain" fit the viewfinder sits -- the "tightening" knob, where
 * the ratio above is the "shape" knob. Both what's drawn (`LensCornerBrackets`) and what's cropped
 * (`utils/cropToViewfinder.ts`) read it through `utils/viewfinderGeometry.ts`, so they can't drift.
 */
export const LENS_VIEWFINDER_FRACTION = 0.78
