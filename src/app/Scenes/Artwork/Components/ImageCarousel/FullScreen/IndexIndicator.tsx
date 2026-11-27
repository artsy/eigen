import { Text, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import { ImageCarouselContext } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { useContext, useMemo } from "react"
import { Animated, Platform, View } from "react-native"
import { boxShadow } from "./boxShadow"
import { useSpringFade } from "./useSpringFade"

/**
 * The index indicator shows the index of the current image being displayed
 * at the bottom of the screen in full screen mode. But only when the image
 * is zoomed completely out!
 */
export const IndexIndicator: React.FC = () => {
  const color = useColor()
  const { safeAreaInsets } = useScreenDimensions()
  const { images, isZoomedCompletelyOut, imageIndex } = useContext(ImageCarouselContext)

  isZoomedCompletelyOut.useUpdates()
  imageIndex.useUpdates()

  const entryOpacity = useSpringFade("in")
  const hideOpacity = useSpringValue(isZoomedCompletelyOut.current ? 1 : 0)
  const opacity = useMemo(() => Animated.multiply(entryOpacity, hideOpacity), [])

  if (images.length === 1) {
    return null
  }
  return (
    <View
      style={{
        position: "absolute",
        // On Android the full screen modal draws behind the navigation bar, so keep the indicator above
        // it (with 3-button navigation it otherwise covers the home button)
        bottom: 20 + (Platform.OS === "android" ? safeAreaInsets.bottom : 0),
        right: 0,
        left: 0,
        height: 30,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          boxShadow,
          {
            borderRadius: 15,
            height: 30,
            backgroundColor: color("mono0"),
            justifyContent: "center",
            paddingHorizontal: 10,
            opacity,
          },
        ]}
      >
        <Text variant="sm">
          {imageIndex.current + 1} of {images.length}
        </Text>
      </Animated.View>
    </View>
  )
}
