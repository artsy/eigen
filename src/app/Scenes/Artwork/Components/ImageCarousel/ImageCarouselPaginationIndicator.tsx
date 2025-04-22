import { Spacer, useColor } from "@artsy/palette-mobile"
import { PaginationDots } from "app/Components/PaginationDots"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useContext } from "react"
import { Animated, View } from "react-native"
import { ImageCarouselContext } from "./ImageCarouselContext"

export type IndicatorType = "dots" | "scrollBar" | undefined

export const PaginationIndicator: React.FC<{ indicatorType: IndicatorType }> = ({
  indicatorType,
}) => {
  if (indicatorType === "scrollBar") {
    return <ScrollBar />
  }
  return <PaginationDotsWrapper />
}

const PaginationDotsWrapper: React.FC = () => {
  const { media } = useContext(ImageCarouselContext)
  const { imageIndex } = useContext(ImageCarouselContext)

  imageIndex.useUpdates()

  return (
    <>
      <Spacer y={2} />
      <PaginationDots length={media.length} currentIndex={imageIndex.current} />
    </>
  )
}

export const ScrollBar: React.FC = () => {
  const color = useColor()
  const { images, xScrollOffsetAnimatedValue } = useContext(ImageCarouselContext)

  const { width: screenWidth } = useScreenDimensions()
  const barWidth = screenWidth / images.length

  if (images.length < 2) {
    return null
  }

  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderBottomWidth: 1,
          borderBottomColor: color("mono30"),
        }}
      />
      <Spacer y={2} />
      <Animated.View
        accessibilityLabel="Image Pagination Scroll Bar"
        style={{
          height: 1,
          width: barWidth,
          backgroundColor: color("mono100"),
          position: "absolute",
          bottom: 0,
          transform: [
            {
              translateX:
                xScrollOffsetAnimatedValue.current?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth - barWidth],
                  extrapolate: "clamp",
                }) ?? 0,
            },
          ],
        }}
      />
    </>
  )
}
