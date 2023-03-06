import { Flex } from "@artsy/palette-mobile"
import { StyleSheet } from "react-native"
import { FrameIndicator } from "./FrameIndicator"

export const FrameIndicators = () => {
  return (
    <Flex flex={1} m={2} pointerEvents="none" {...StyleSheet.absoluteFillObject}>
      <FrameIndicator placement="top-left" />
      <FrameIndicator placement="top-right" />
      <FrameIndicator placement="bottom-left" />
      <FrameIndicator placement="bottom-right" />
    </Flex>
  )
}
