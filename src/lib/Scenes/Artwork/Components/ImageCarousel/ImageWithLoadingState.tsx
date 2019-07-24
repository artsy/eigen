import { color } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import Spinner from "lib/Components/Spinner"
import React, { useEffect, useState } from "react"
import { Animated, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import { useSpringValue } from "./useSpringValue"

interface ImageWithLoadingStateProps {
  width: number
  height: number
  imageURL: string
  onLoad?: () => void
  onPress?: () => void
  style?: ViewProps["style"]
}
/**
 * Renders an image with a 'fade in' transition when it has loaded.
 * If the image takes more than a second to load, it shows a
 * loading spinner with a silhouette for good UX.
 *
 * @param param0 same as RN's Image props
 */
export const ImageWithLoadingState = React.forwardRef<View, ImageWithLoadingStateProps>(({ ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(true)

  // When the image has loaded we want to fade it in, so we have a white overlay
  // this assumes the image will be on a white backdrop. This component will
  // need to be significantly refactored if it ever needs to be used with other
  // color backgrounds
  const overlayOpacity = useSpringValue(isLoading ? 1 : 0)

  // show a loading spinner only after a short delay, if the image is taking a while to load
  const [showingSpinner, setShowingSpinner] = useState(false)
  const spinnerOpacity = useSpringValue(showingSpinner ? 1 : 0)
  useEffect(() => {
    setTimeout(() => setShowingSpinner(true), 1000)
  }, [])
  const { width, height, imageURL, onPress } = props
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ width, height }, props.style]} ref={ref}>
        <View style={{ position: "absolute", width, height }}>
          <OpaqueImageView
            noAnimation
            disableGemini
            onLoad={() => {
              setIsLoading(false)
              if (props.onLoad) {
                props.onLoad()
              }
            }}
            imageURL={imageURL}
            aspectRatio={width / height}
            style={{ width, height }}
          />
        </View>
        <Animated.View
          style={{
            position: "absolute",
            width,
            height,
            opacity: overlayOpacity,
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <Animated.View
            style={{
              opacity: spinnerOpacity,
              // give the image a subtle silhouette while the spinner is displaying
              // to keep the balance of the page and set an appropriate user expectation
              backgroundColor: color("black5"),
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Spinner />
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
})
