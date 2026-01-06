import { Image } from "@artsy/palette-mobile"
import React from "react"
import { TouchableWithoutFeedback, View, ViewProps } from "react-native"

interface ImageWithLoadingStateProps {
  width: number
  height: number
  imageURL: string
  blurhash?: string | null | undefined
  onLoad?: () => void
  onPress?: () => void
  style?: ViewProps["style"]
  highPriority?: boolean
}
/**
 * Renders an image with a 'fade in' transition when it has loaded.
 * If the image takes more than a second to load, it shows a
 * loading spinner with a silhouette for good UX.
 *
 * @param param0 same as RN's Image props
 */
export const ImageWithLoadingState = React.forwardRef<View, ImageWithLoadingStateProps>(
  (props, ref) => {
    // When the image has loaded we want to fade it in, so we have a white overlay
    // this assumes the image will be on a white backdrop. This component will
    // need to be significantly refactored if it ever needs to be used with other
    // color backgrounds
    // show a loading spinner only after a short delay, if the image is taking a while to load
    const { width, height, imageURL, blurhash, onPress } = props

    return (
      <TouchableWithoutFeedback onPress={onPress} accessibilityLabel="Image with Loading State">
        <View style={[{ width, height }, props.style]} ref={ref}>
          <Image
            blurhash={blurhash}
            src={imageURL}
            performResize={false}
            aspectRatio={width / height}
            height={height}
            width={width}
            testID="ImageWithLoadingState"
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
)
