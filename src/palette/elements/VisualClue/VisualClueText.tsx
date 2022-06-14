import { Flex, PopIn, Text, useColor } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

const WRAPPER_WIDTH = 56
const WRAPPER_HEIGHT = 46

export const VisualClueText: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style = {} }) => {
  const colors = useColor()

  return (
    <Flex width={0} overflow="visible">
      <Flex width={55} justifyContent="center">
        <Flex
          style={{
            width: WRAPPER_WIDTH,
            height: WRAPPER_HEIGHT,
            ...(style as object),
            position: "absolute",
          }}
        >
          <PopIn>
            <Text style={{ fontSize: 12, color: colors("blue100") }}>New</Text>
          </PopIn>
        </Flex>
      </Flex>
    </Flex>
  )
}
