import { Box, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { GestureResponderEvent, Image, TouchableWithoutFeedback } from "react-native"

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
        <Box ml={1}>
          <Image
            style={{ tintColor: color("black30"), top: 3 }}
            source={require("../../../../images/horizontal_chevron.png")}
          />
        </Box>
      </Flex>
    </TouchableWithoutFeedback>
  )
}
