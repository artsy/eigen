import { Flex } from "@artsy/palette-mobile"
import { computeViewfinderRect } from "app/Scenes/Lens/utils/viewfinderGeometry"

type BracketPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const BRACKET_THICKNESS = 3
const BRACKET_SIZE = 28

interface LensCornerBracketsProps {
  /** The dimensions of whatever this is rendered inside -- the full screen on the live capture
   * screen, or the (smaller, but same aspect-ratio-shaped) preview card on the analyzing screen.
   * Required rather than defaulting to `useWindowDimensions()` internally: this component doesn't
   * know its own render context, and silently assuming "always full screen" was exactly the bug
   * that made the brackets render wrong on the analyzing screen's smaller preview card. */
  width: number
  height: number
}

/**
 * Marks a real, centered `LENS_VIEWFINDER_ASPECT_RATIO`-shaped rect (see `constants.ts`) within
 * its container -- not the container's own aspect ratio, and not a square. This is the rect the
 * captured photo eventually gets cropped to for matching, so it's not purely cosmetic. The
 * *preview* underneath still renders full-bleed regardless (per the spike plan: never make the
 * live preview itself read as a crop box) -- this overlay only marks intent, it doesn't constrain
 * layout. `pointerEvents="none"` so it never intercepts the tap-to-focus/pinch-to-zoom gestures
 * underneath.
 */
export const LensCornerBrackets: React.FC<LensCornerBracketsProps> = ({ width, height }) => {
  const rect = computeViewfinderRect(width, height)

  return (
    <Flex
      position="absolute"
      left={rect.originX}
      top={rect.originY}
      width={rect.width}
      height={rect.height}
      pointerEvents="none"
    >
      <Bracket placement="top-left" />
      <Bracket placement="top-right" />
      <Bracket placement="bottom-left" />
      <Bracket placement="bottom-right" />
    </Flex>
  )
}

const Bracket: React.FC<{ placement: BracketPlacement }> = ({ placement }) => {
  const { container, arm } = getPropsByPlacement(placement)

  return (
    <Flex position="absolute" {...container}>
      <Flex
        width={BRACKET_SIZE}
        height={BRACKET_THICKNESS}
        bg="mono0"
        position="absolute"
        {...arm}
      />
      <Flex
        width={BRACKET_THICKNESS}
        height={BRACKET_SIZE}
        bg="mono0"
        position="absolute"
        {...arm}
      />
    </Flex>
  )
}

const getPropsByPlacement = (placement: BracketPlacement) => {
  switch (placement) {
    case "top-left":
      return { container: { top: 0, left: 0 }, arm: { top: 0, left: 0 } }
    case "top-right":
      return { container: { top: 0, right: 0 }, arm: { top: 0, right: 0 } }
    case "bottom-left":
      return { container: { bottom: 0, left: 0 }, arm: { bottom: 0, left: 0 } }
    case "bottom-right":
      return { container: { bottom: 0, right: 0 }, arm: { bottom: 0, right: 0 } }
  }
}
