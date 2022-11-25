import { useContext, useEffect } from "react"
import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"

import FastImage from "react-native-fast-image"
import { Zoom } from "react-native-reanimated-zoom"
import usePrevious from "react-use/lib/usePrevious"
import { useScreenDimensions } from "shared/hooks/useScreenDimensions"

export interface ImageZoomViewAndroidProps {
  image: ImageDescriptor
  index: number
}

export const ImageZoomViewAndroid: React.FC<ImageZoomViewAndroidProps> = ({ image, index }) => {
  const { dispatch, images, imageIndex, fullScreenState } = useContext(ImageCarouselContext)
  imageIndex.useUpdates()
  fullScreenState.useUpdates()

  const previousImageIndex = usePrevious(imageIndex.current) ?? -1

  useEffect(() => {
    if (fullScreenState.current !== "entered") {
      dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })

      requestAnimationFrame(() => {
        dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
      })
    }
  }, [])

  useEffect(() => {
    // If there are still images available to load, then we want to preload the next one
    if (
      imageIndex.current < images.length - 1 &&
      index === imageIndex.current &&
      // Only preload the next image if the user is swiping right
      previousImageIndex < imageIndex.current
    ) {
      FastImage.preload([
        {
          uri: images[imageIndex.current + 1].largeImageURL!,
        },
      ])
    }
  }, [imageIndex.current, previousImageIndex])

  const { width: screenWidth } = useScreenDimensions()

  return (
    <Zoom>
      <FastImage
        source={{
          uri: image.largeImageURL!,
        }}
        style={{
          width: screenWidth,
          height: (image.height! * screenWidth) / image.width!,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </Zoom>
  )
}
