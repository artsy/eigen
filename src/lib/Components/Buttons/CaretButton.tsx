import { color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { GestureResponderEvent, Image, TouchableWithoutFeedback } from "react-native"

interface Props {
  onPress?: (ev: GestureResponderEvent) => void
  text: string
}

export const CaretButton: React.SFC<Props> = ({ text, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Flex alignItems="center" justifyContent="space-between" flexDirection="row" height={36}>
        <Sans size="3t" weight="medium">
          {text}
          {"  "}
          <Image
            style={{ alignSelf: "center", tintColor: color("black30") }}
            source={require("../../../../images/horizontal_chevron.png")}
          />
        </Sans>
      </Flex>
    </TouchableWithoutFeedback>
  )
}
