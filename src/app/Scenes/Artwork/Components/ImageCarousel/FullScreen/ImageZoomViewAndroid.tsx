import { Flex, useColor, Spinner } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
import {
  ImageCarouselContext,
  ImageDescriptor,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { useContext, useEffect, useState } from "react"
import { LayoutAnimation } from "react-native"
import { Zoom } from "react-native-reanimated-zoom"
import usePrevious from "react-use/lib/usePrevious"

export interface ImageZoomViewAndroidProps {
  image: ImageDescriptor
  index: number
}

export const ImageZoomViewAndroid: React.FC<ImageZoomViewAndroidProps> = ({ image, index }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const color = useColor()

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
            opacity,
            backgroundColor: color("mono10"),
          }}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => {
            requestAnimationFrame(() => {
              setIsLoading(true)
            })
          }}
          onLoadEnd={() => {
            requestAnimationFrame(() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              setOpacity(1)
              setIsLoading(false)
            })
          }}
        />
        {!!isLoading && (
          <Flex
            position="absolute"
            top={0}
            pt={`${imageHeight / 2}px`}
            left={0}
            opacity={0.5}
            backgroundColor="mono10"
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
