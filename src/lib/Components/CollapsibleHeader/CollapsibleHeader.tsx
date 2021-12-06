import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Box, Flex, Separator, Text, useTheme } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import Animated, { Extrapolate } from "react-native-reanimated"
import { useCollapsibleHeaderContext } from "./CollapsibleHeaderContext"

const AnimatedText: typeof Text = Animated.createAnimatedComponent(Text)

export interface CollapsibleHeaderProps {
  title: string
  rightButtonDisabled?: boolean
  rightButtonText?: string
  onLeftButtonPress: () => void
  onRightButtonPress?: () => void
}

export const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = (props) => {
  const { title, rightButtonDisabled, rightButtonText, onLeftButtonPress, onRightButtonPress } = props
  const { space } = useTheme()
  const { scrollOffsetY, stickyHeaderContent, headerHeight } = useCollapsibleHeaderContext()
  const headerIsFullyUp = Animated.greaterThan(scrollOffsetY, headerHeight)
  const offset = Animated.cond(headerIsFullyUp, headerHeight, Animated.max(scrollOffsetY, 0))
  const translateY = Animated.multiply(offset, -1)

  // Animation for fontSize happens with jerks on android. For this reason, scale is used to reduce the size of the text
  const scale = Animated.interpolate(scrollOffsetY, {
    inputRange: [0, headerHeight],
    outputRange: [1, 0.77],
    extrapolate: Extrapolate.CLAMP,
  })

  return (
    <Box position="absolute" top={0} left={0} right={0} backgroundColor="white">
      <FancyModalHeader hideBottomDivider onLeftButtonPress={onLeftButtonPress} />
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 1,
          transform: [{ translateY }],
        }}
      >
        <Box height={headerHeight} pointerEvents="none" />
        <Flex
          height={headerHeight}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mx={2}
          pointerEvents="box-none"
        >
          <AnimatedText
            variant="lg"
            // @ts-ignore
            style={{ flex: 1, transform: [{ scale }], marginRight: space(1) }}
            numberOfLines={2}
          >
            {title}
          </AnimatedText>
          {!!(onRightButtonPress && rightButtonText) && (
            <TouchableOpacity disabled={rightButtonDisabled} onPress={onRightButtonPress}>
              <Text
                variant="sm"
                style={{ textDecorationLine: "underline" }}
                color={rightButtonDisabled ? "black30" : "black100"}
              >
                {rightButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </Flex>
        <Separator />
        {stickyHeaderContent}
      </Animated.View>
    </Box>
  )
}
