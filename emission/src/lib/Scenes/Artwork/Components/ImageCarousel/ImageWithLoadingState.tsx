import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { TouchableWithoutFeedback, View, ViewProps } from "react-native"

interface ImageWithLoadingStateProps {
  width: number
  height: number
  imageURL: string
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
export const ImageWithLoadingState = React.forwardRef<View, ImageWithLoadingStateProps>((props, ref) => {
  // When the image has loaded we want to fade it in, so we have a white overlay
  // this assumes the image will be on a white backdrop. This component will
  // need to be significantly refactored if it ever needs to be used with other
  // color backgrounds
  // show a loading spinner only after a short delay, if the image is taking a while to load
  const { width, height, imageURL, onPress } = props
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ width, height }, props.style]} ref={ref}>
        <OpaqueImageView
          useRawURL
          onLoad={() => {
            if (props.onLoad) {
              props.onLoad()
            }
          }}
          imageURL={imageURL}
          aspectRatio={width / height}
          style={{ width, height }}
          highPriority={props.highPriority}
        />
      </View>
    </TouchableWithoutFeedback>
  )
})
