import { Sans } from "@artsy/palette"
import { observer } from "mobx-react"
import { useContext, useMemo } from "react"
import React from "react"
import { Animated, View } from "react-native"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { useSpringValue } from "../useSpringValue"
import { boxShadow } from "./boxShadow"
import { useSpringFade } from "./useSpringFade"

/**
 * The index indicator shows the index of the current image being displayed
 * at the bottom of the screen in full screen mode. But only when the image
 * is zoomed completely out!
 */
export const IndexIndicator: React.FC = observer(() => {
  const { images, state } = useContext(ImageCarouselContext)

  const entryOpacity = useSpringFade("in")
  const hideOpacity = useSpringValue(state.isZoomedCompletelyOut ? 1 : 0)
  const opacity = useMemo(() => Animated.multiply(entryOpacity, hideOpacity), [])

  if (images.length === 1) {
    return null
  }
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
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
            backgroundColor: "white",
            justifyContent: "center",
            paddingHorizontal: 10,
            opacity,
          },
        ]}
      >
        <Sans size="3">
          {state.imageIndex + 1} of {images.length}
        </Sans>
      </Animated.View>
    </View>
  )
})
