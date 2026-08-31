import { Flex } from "@artsy/palette-mobile"
import { computeViewfinderRect } from "app/Scenes/Lens/utils/viewfinderGeometry"

type BracketPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const BRACKET_THICKNESS = 3
const BRACKET_SIZE = 28

interface LensCornerBracketsProps {
  width: number
  height: number
}

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
