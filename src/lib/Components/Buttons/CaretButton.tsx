import { Display, Flex } from "@artsy/palette"
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
        <Display size="4t">{text}</Display>
        <Image style={{ alignSelf: "center" }} source={require("../../../../images/horizontal_chevron.png")} />
      </Flex>
    </TouchableWithoutFeedback>
  )
}
