import { FocusCoords } from "app/Scenes/ReverseImage/types"
import { Flex } from "palette"

interface FocusIndicatorProps {
  coords: FocusCoords
}

const FOCUS_INDICATOR_SIZE = 30
const FOCUS_INDICATOR_HALF_SIZE = FOCUS_INDICATOR_SIZE / 2

export const FocusIndicator: React.FC<FocusIndicatorProps> = (props) => {
  const { coords } = props

  return (
    <Flex
      width={FOCUS_INDICATOR_SIZE}
      height={FOCUS_INDICATOR_SIZE}
      borderRadius={FOCUS_INDICATOR_SIZE}
      bg="white100"
      opacity={0.5}
      position="absolute"
      top={coords.y - FOCUS_INDICATOR_HALF_SIZE}
      left={coords.x - FOCUS_INDICATOR_HALF_SIZE}
    />
  )
}
