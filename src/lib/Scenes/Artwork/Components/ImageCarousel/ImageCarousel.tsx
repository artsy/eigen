import { Flex, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView"
import React, { useCallback, useContext, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { fitInside } from "./geometry"
import { baseCardBoundingBox, ImageCarouselBase } from "./ImageCarouselBase"
import { FullScreenState, ImageCarouselAction, ImageCarouselContext } from "./ImageCarouselContext"
import { ImageCarouselFullScreen } from "./ImageCarouselFullScreen"
import { PaginationDot } from "./PaginationDot"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

export interface ImageDescriptor {
  url: string
  width: number
  height: number
}

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = props => {
  const images: ImageDescriptor[] = useMemo(
    () =>
      props.images.map(image => {
        const { width, height } = fitInside(baseCardBoundingBox, image)
        return {
          width,
          height,
          url: createGeminiUrl({
            imageURL: image.image_url.replace(":version", "normalized"),
            width,
            height,
          }),
        }
      }),
    [props.images]
  )
  const baseImageRefs = useMemo(() => [], [])
  const baseFlatListRef = useRef<FlatList<any>>()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [fullScreenState, setFullScreenState] = useState<FullScreenState>("none")

  const isFullScreen = fullScreenState !== "none"

  const dispatch = useCallback(
    (action: ImageCarouselAction) => {
      // console.warn(action)
      switch (action.type) {
        case "IMAGE_INDEX_CHANGED":
          setCurrentImageIndex(action.nextImageIndex)
          if (isFullScreen) {
            baseFlatListRef.current.scrollToIndex({ index: action.nextImageIndex, animated: false })
          }
          break
        case "FULL_SCREEN_DISMISSED":
          setFullScreenState("none")
          break
        case "TAPPED_TO_GO_FULL_SCREEN":
          setFullScreenState("doing first render")
          break
        case "FULL_SCREEN_INITIAL_RENDER_COMPLETED":
          setFullScreenState("animating entry transition")
          break
        case "FULL_SCREEN_FINISHED_ENTERING":
          setFullScreenState("entered")
          break
      }
    },
    [isFullScreen]
  )

  return (
    <ImageCarouselContext.Provider
      value={{
        dispatch,
        baseFlatListRef,
        baseImageRefs,
        currentImageIndex,
        images,
        fullScreenState,
      }}
    >
      <Flex>
        <ImageCarouselBase />
        {images.length > 1 && <PaginationDots />}
        {isFullScreen && <ImageCarouselFullScreen />}
      </Flex>
    </ImageCarouselContext.Provider>
  )
}

function PaginationDots() {
  const { currentImageIndex, images } = useContext(ImageCarouselContext)
  return (
    <>
      <Spacer mb={2} />
      <Flex flexDirection="row" justifyContent="center">
        {images.map((_, index) => (
          <PaginationDot key={index} diameter={5} selected={index === currentImageIndex} />
        ))}
      </Flex>
    </>
  )
}

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  images: graphql`
    fragment ImageCarousel_images on Image @relay(plural: true) {
      image_url
      width
      height
    }
  `,
})
