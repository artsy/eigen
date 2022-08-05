import { FocusCoords } from "app/Scenes/ReverseImage/types"
import { Flex } from "palette"
import { useEffect, useRef } from "react"

interface FocusIndicatorProps {
  coords: FocusCoords
  onHide: () => void
}

const FOCUS_INDICATOR_SIZE = 30
const FOCUS_INDICATOR_HALF_SIZE = FOCUS_INDICATOR_SIZE / 2
const HIDE_TIMEOUT = 400

// TODO: Use react-native-reanimated 2 when it will be used
export const FocusIndicator: React.FC<FocusIndicatorProps> = (props) => {
  const { coords, onHide } = props
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }

    timer.current = setTimeout(() => {
      onHide()
    }, HIDE_TIMEOUT)
  }, [coords.x, coords.y, onHide])

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
