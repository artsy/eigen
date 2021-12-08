import { Flex, Spacer, useColor } from "palette"
import React, { useContext } from "react"
import { Animated } from "react-native"
import { ImageCarouselContext } from "./ImageCarouselContext"
import { useSpringValue } from "./useSpringValue"

export const PaginationIndicator: React.FC<{ indicatorStyle?: "dots" | "bar" }> = ({ indicatorStyle = "dots" }) => {
  if (indicatorStyle === "dots") {
    return <PaginationDots />
  } else if (indicatorStyle === "bar") {
    return null
  }
  return null
}

function PaginationDots() {
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

export const PaginationDot = ({ diameter, index }: { diameter: number; index: number }) => {
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

const ScrollBar: React.FC<{ numberOfImages?: number }> = ({ numberOfImages }) => {
  if (!numberOfImages) {
    return null
  }

  useContext(ImageCarouselContext)
  const color = useColor()
  // We resize this border using the `scaleX` transform property rather than the `width` property, to avoid running
  // animations on the JS thread, so we need to set an initial, pre-transform span for the border.
  const preTransformSpan = 100

  const span = tabLayouts[activeTabIndex].width

  let left = 0
  for (let i = 0; i < activeTabIndex; i++) {
    left += tabLayouts[i].width
  }

  const translateX = useRef(new Animated.Value(left)).current
  const scaleX = useRef(new Animated.Value(span / preTransformSpan)).current

  useEffect(() => {
    Animated.parallel([spring(translateX, left), spring(scaleX, span / preTransformSpan)]).start()
  }, [left, span])

  const scaleXOffset = Animated.divide(
    Animated.subtract(preTransformSpan, Animated.multiply(scaleX, preTransformSpan)),
    2
  )

  return (
    <Animated.View
      style={{
        height: 1,
        width: preTransformSpan,
        backgroundColor: color("black100"),
        position: "absolute",
        bottom: 0,
        transform: [
          {
            translateX: Animated.subtract(translateX, scaleXOffset),
          },
          {
            scaleX,
          },
        ],
      }}
    />
  )
}
