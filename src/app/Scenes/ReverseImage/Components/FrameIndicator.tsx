import { Flex } from "@artsy/palette-mobile"

type FrameIndicatorPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right"

interface FrameIndicatorProps {
  placement: FrameIndicatorPlacement
}

const FRAME_INDICATOR_THICKNESS = 5
const FRAME_INDICATOR_SIZE = 40

export const FrameIndicator: React.FC<FrameIndicatorProps> = ({ placement }) => {
  const props = getPropsByPlacement(placement)

  return (
    <Flex position="absolute" {...props.container}>
      {/* Horizontal */}
      <Flex
        width={FRAME_INDICATOR_SIZE}
        height={FRAME_INDICATOR_THICKNESS}
        bg="white100"
        position="absolute"
        {...props.frame}
      />

      {/* Vertical */}
      <Flex
        width={FRAME_INDICATOR_THICKNESS}
        height={FRAME_INDICATOR_SIZE}
        bg="white100"
        position="absolute"
        {...props.frame}
      />
    </Flex>
  )
}

const getPropsByPlacement = (placement: FrameIndicatorPlacement) => {
  if (placement === "top-left") {
    return {
      container: {
        top: 0,
        left: 0,
      },
      frame: {
        top: -FRAME_INDICATOR_THICKNESS,
        left: -FRAME_INDICATOR_THICKNESS,
      },
    }
  }

  if (placement === "top-right") {
    return {
      container: {
        top: 0,
        right: 0,
      },
      frame: {
        top: -FRAME_INDICATOR_THICKNESS,
        right: -FRAME_INDICATOR_THICKNESS,
      },
    }
  }

  if (placement === "bottom-left") {
    return {
      container: {
        bottom: 0,
        left: 0,
      },
      frame: {
        bottom: -FRAME_INDICATOR_THICKNESS,
        left: -FRAME_INDICATOR_THICKNESS,
      },
    }
  }

  if (placement === "bottom-right") {
    return {
      container: {
        bottom: 0,
        right: 0,
      },
      frame: {
        bottom: -FRAME_INDICATOR_THICKNESS,
        right: -FRAME_INDICATOR_THICKNESS,
      },
    }
  }

  throw new Error("Passed invalid placement for FrameIndicator")
}
