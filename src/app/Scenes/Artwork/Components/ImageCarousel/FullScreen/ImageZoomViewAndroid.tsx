import { useContext, useEffect, useState } from "react"
import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"

import { Flex, Spinner } from "palette"
import FastImage from "react-native-fast-image"
import { Zoom } from "react-native-reanimated-zoom"
import usePrevious from "react-use/lib/usePrevious"
import { useScreenDimensions } from "shared/hooks/useScreenDimensions"

export interface ImageZoomViewAndroidProps {
  image: ImageDescriptor
  index: number
}

export const ImageZoomViewAndroid: React.FC<ImageZoomViewAndroidProps> = ({ image, index }) => {
  const [isLoading, setIsLoading] = useState(false)
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

  const { width: screenWidth, height: screenHeight } = useScreenDimensions()

  let imageHeight = (image.height! * screenWidth) / image.width!
  let imageWidth = screenWidth

  // Make sure image doesn't get out of bounds
  if (imageHeight > screenHeight) {
    imageWidth = (image.width! * screenHeight) / image.height!
    imageHeight = screenHeight
  }

  return (
    <Flex width={screenWidth} height={screenHeight} alignItems="center" justifyContent="center">
      <Zoom>
        <FastImage
          source={{
            uri: image.largeImageURL!,
          }}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => {
            setIsLoading(true)
          }}
          onLoadEnd={() => {
            setIsLoading(false)
          }}
        />
        {!!isLoading && (
          <Flex
            position="absolute"
            top={0}
            pt={imageHeight / 2}
            left={0}
            opacity={0.5}
            backgroundColor="black10"
            width={screenWidth}
            height={imageHeight}
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Flex>
        )}
      </Zoom>
    </Flex>
  )
}
