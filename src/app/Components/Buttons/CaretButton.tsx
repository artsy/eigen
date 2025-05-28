import { Flex, Box, Text } from "@artsy/palette-mobile"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import { GestureResponderEvent, TouchableOpacity } from "react-native"

interface Props {
  onPress?: (ev: GestureResponderEvent) => void
  text: string
  textColor?: string
  testID?: string
}

export const CaretButton: React.FC<Props> = ({ text, onPress, textColor, testID }) => {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} testID={testID}>
      <Flex flexDirection="row" align-items="base-line">
        <Text variant="sm" weight="medium" color={textColor}>
          {text}
        </Text>
        <Box ml={0.5} style={{ marginTop: 1.5 }} justifyContent="center">
          <ChevronIcon />
        </Box>
      </Flex>
    </TouchableOpacity>
  )
}
