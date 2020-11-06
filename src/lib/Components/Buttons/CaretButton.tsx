import ChevronIcon from "lib/Icons/ChevronIcon"
import { Box, Flex, Sans, Touchable } from "palette"
import React from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"

interface Props {
  onPress?: (ev: GestureResponderEvent) => void
  text: string
  textColor?: string
  withFeedback?: boolean
}

export const CaretButton: React.FC<Props> = ({ text, onPress, textColor, withFeedback = false }) => {
  const TouchableComponent = withFeedback ? Touchable : TouchableWithoutFeedback
  return (
    <TouchableComponent onPress={onPress}>
      <Flex flexDirection="row" align-items="base-line">
        <Sans size="3t" weight="medium" color={textColor}>
          {text}
        </Sans>
        <Box ml={0.5} style={{ marginTop: 1.5 }}>
          <ChevronIcon />
        </Box>
      </Flex>
    </TouchableComponent>
  )
}
