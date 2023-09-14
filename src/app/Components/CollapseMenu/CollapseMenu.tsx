import { ChevronIcon, Flex, Text } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useEffect, useState } from "react"
import { LayoutAnimation, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export const CollapseMenu: React.FC<{
  chevronStyle?: ViewStyle
  closed?: boolean
  title: string
}> = ({ chevronStyle, children, closed = false, title }) => {
  const [showContent, setShowContent] = useState(!closed)

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [showContent])

  return (
    <Flex>
      <TouchableOpacity onPress={() => void setShowContent(!showContent)}>
        <Flex ml={2} mt={1} mb={1} mr={2} flexDirection="row" justifyContent="space-between">
          <Text variant="sm-display">{title}</Text>
          <MotiView
            animate={{
              rotateZ: showContent ? "180deg" : "0deg",
            }}
            transition={{
              type: "timing",
            }}
            style={chevronStyle}
          >
            <ChevronIcon direction="down" fill="black60" />
          </MotiView>
        </Flex>
      </TouchableOpacity>

      {showContent ? children : null}
    </Flex>
  )
}
