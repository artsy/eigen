import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import { COMPOSER_TIMING } from "app/Scenes/ArtAssistant/Components/ArtAssistantComposer"
import React, { useEffect, useRef } from "react"
import { LayoutChangeEvent } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const DISCLAIMER_LINE_HEIGHT = parseInt(THEME.textVariants.xs.lineHeight, 10)

interface ArtAssistantDisclaimerProps {
  isVisible: boolean
}

/**
 * The notice above the composer. It folds away while the composer expands, and back while it
 * collapses, on the same timing, so that the screen above them doesn't jump.
 *
 * Only its height animates. A fade on the text, next to a view whose height animates on every
 * frame, got stuck where it started.
 */
export const ArtAssistantDisclaimer: React.FC<ArtAssistantDisclaimerProps> = ({ isVisible }) => {
  const space = useSpace()
  const bottomPadding = space(1)
  // A single line until the text is measured, e.g. when a larger font size wraps it.
  const textHeight = useRef(DISCLAIMER_LINE_HEIGHT + bottomPadding)
  const height = useSharedValue(isVisible ? textHeight.current : 0)

  useEffect(() => {
    height.set(withTiming(isVisible ? textHeight.current : 0, COMPOSER_TIMING))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height
    if (nextHeight === textHeight.current) {
      return
    }

    textHeight.current = nextHeight
    if (isVisible) {
      height.set(nextHeight)
    }
  }

  const heightAnimatedStyle = useAnimatedStyle(() => ({ height: height.get() }))

  return (
    <Animated.View
      accessibilityElementsHidden={!isVisible}
      importantForAccessibility={isVisible ? "auto" : "no-hide-descendants"}
      style={[{ overflow: "hidden" }, heightAnimatedStyle]}
    >
      {/* Positioned absolutely, the text keeps its own height, and so its measurement, while the
          view around it folds to nothing. */}
      <Flex left={0} onLayout={handleTextLayout} position="absolute" right={0} top={0}>
        <Text variant="xs" color="mono60" pb={`${bottomPadding}px`} textAlign="center">
          Art Assistant is AI and can make mistakes
        </Text>
      </Flex>
    </Animated.View>
  )
}
