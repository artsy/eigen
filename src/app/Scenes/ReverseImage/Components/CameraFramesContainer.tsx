import { Flex, useSpace } from "palette"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"
import { Background } from "./Background"
import { FrameIndicators } from "./FrameIndicators"

interface CameraFramesContainerProps {
  focusEnabled?: boolean
  onFocusPress?: (x: number, y: number) => void
}

export const CameraFramesContainer: React.FC<CameraFramesContainerProps> = (props) => {
  const { focusEnabled, onFocusPress } = props
  const space = useSpace()

  const handleFocus = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent
    onFocusPress?.(pageX, pageY)
  }

  return (
    <Flex flex={1}>
      <Background height={space("2")} />

      <Flex flex={1} flexDirection="row">
        <Background width={space("2")} />
        <TouchableWithoutFeedback onPress={handleFocus} disabled={!focusEnabled}>
          <Flex flex={1} />
        </TouchableWithoutFeedback>
        <Background width={space("2")} />
      </Flex>

      <Background height={space("2")} />

      <FrameIndicators />
    </Flex>
  )
}
