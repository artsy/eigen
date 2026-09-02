import { Flex } from "@artsy/palette-mobile"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

const BORDER_SIZE = 2
const LARGE_BUTTON_SIZE = 56 + BORDER_SIZE
const SMALL_BUTTON_SIZE = 48

export const LensCapturePhotoButton: React.FC<TouchableOpacityProps> = (props) => {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Take photo" {...props}>
      <Flex
        width={LARGE_BUTTON_SIZE}
        height={LARGE_BUTTON_SIZE}
        borderRadius={LARGE_BUTTON_SIZE}
        borderWidth={BORDER_SIZE}
        borderColor="mono0"
      />

      <Flex {...StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
        <Flex
          width={SMALL_BUTTON_SIZE}
          height={SMALL_BUTTON_SIZE}
          borderRadius={SMALL_BUTTON_SIZE}
          bg="mono0"
        />
      </Flex>
    </TouchableOpacity>
  )
}
