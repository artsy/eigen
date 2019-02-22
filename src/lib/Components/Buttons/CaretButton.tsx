import { Box, Flex, Sans } from "@artsy/palette"
import ChevronIcon from "lib/Icons/ChevronIcon"
import React from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"

interface Props {
  onPress?: (ev: GestureResponderEvent) => void
  text: string
}

export const CaretButton: React.SFC<Props> = ({ text, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Flex flexDirection="row" align-items="base-line">
        <Sans size="3t" weight="medium">
          {text}
        </Sans>
        <Box ml={0.5} style={{ marginTop: 1.5 }}>
          <ChevronIcon />
        </Box>
      </Flex>
    </TouchableWithoutFeedback>
  )
}
