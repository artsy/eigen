import { Flex, useColor, Spinner } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
import {
  ImageCarouselContext,
  ImageDescriptor,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { RefObject, useContext, useEffect, useState } from "react"
import { LayoutAnimation } from "react-native"
import Zoom, { ScrollableRef } from "react-native-zoom-reanimated"
import usePrevious from "react-use/lib/usePrevious"

export interface ImageZoomViewAndroidProps {
  image: ImageDescriptor
  index: number
  width: number
  height: number
  parentScrollRef: RefObject<ScrollableRef | null>
}

export const ImageZoomViewAndroid: React.FC<ImageZoomViewAndroidProps> = ({
  image,
  index,
  width: screenWidth,
  height: screenHeight,
  parentScrollRef,
}) => {
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
      const nextImageURL = images[imageIndex.current + 1].largeImageURL
      if (nextImageURL) {
        FastImage.preload([{ uri: nextImageURL }])
      }
    }
  }, [imageIndex.current, previousImageIndex])

  // Fall back to filling the page when the image has no dimensions
  const aspectRatio =
    image.width && image.height ? image.width / image.height : screenWidth / screenHeight

  let imageHeight = screenWidth / aspectRatio
  let imageWidth = screenWidth

  // Make sure image doesn't get out of bounds
  if (imageHeight > screenHeight) {
    imageWidth = screenHeight * aspectRatio
    imageHeight = screenHeight
  }

  return (
    <Flex width={screenWidth} height={screenHeight} alignItems="center" justifyContent="center">
      <Zoom
        // fill the page so pan bounds and gallery-swipe edges are measured against the screen
        style={{ width: screenWidth, height: screenHeight }}
        maxScale={8}
        enableGallerySwipe
        parentScrollRef={parentScrollRef}
        currentIndex={index}
        itemWidth={screenWidth}
      >
        <FastImage
          source={{
            uri: image.largeImageURL ?? undefined,
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
