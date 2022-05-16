import { Flex, Spacer, useColor } from "palette"
import React, { useContext } from "react"
import { Animated, View } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { ImageCarouselContext } from "./ImageCarouselContext"
import { useSpringValue } from "./useSpringValue"

export type IndicatorType = "dots" | "scrollBar" | undefined

export const PaginationIndicator: React.FC<{ indicatorType: IndicatorType }> = ({
  indicatorType,
}) => {
  if (indicatorType === "scrollBar") {
    return <ScrollBar />
  }
  return <PaginationDots />
}

const PaginationDots: React.FC = () => {
  const { images } = useContext(ImageCarouselContext)
  return (
    <>
      <Spacer mb={2} />
      <Flex flexDirection="row" justifyContent="center">
        {images.map((_, index) => (
          <PaginationDot key={index} diameter={5} index={index} />
        ))}
      </Flex>
    </>
  )
}

export const PaginationDot: React.FC<{ diameter: number; index: number }> = ({
  diameter,
  index,
}) => {
  const { imageIndex } = useContext(ImageCarouselContext)
  imageIndex.useUpdates()
  const opacity = useSpringValue(imageIndex.current === index ? 1 : 0.1)

  return (
    <Animated.View
      style={{
        marginHorizontal: diameter * 0.8,
        borderRadius: diameter / 2,
        width: diameter,
        height: diameter,
        backgroundColor: "black",
        opacity,
      }}
    />
  )
}

export const ScrollBar: React.FC = () => {
  const color = useColor()
  const { images, xScrollOffsetAnimatedValue } = useContext(ImageCarouselContext)
  if (images.length < 2) {
    return null
  }

  const { width: screenWidth } = useScreenDimensions()
  const barWidth = screenWidth / images.length

  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderBottomWidth: 1,
          borderBottomColor: color("black30"),
        }}
      />
      <Spacer mb={2} />
      <Animated.View
        style={{
          height: 1,
          width: barWidth,
          backgroundColor: color("black100"),
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
