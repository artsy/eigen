import { Flex, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { observer } from "mobx-react"
import React, { useContext, useMemo } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { isPad } from "../../hardware"
import { ImageCarouselFullScreen } from "./FullScreen/ImageCarouselFullScreen"
import { fitInside } from "./geometry"
import { ImageCarouselContext, ImageDescriptor, useNewImageCarouselContext } from "./ImageCarouselContext"
import { ImageCarouselEmbedded } from "./ImageCarouselEmbedded"
import { useSpringValue } from "./useSpringValue"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel = observer((props: ImageCarouselProps) => {
  const screenDimensions = useScreenDimensions()
  // The logic for cardHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  const cardHeight = screenDimensions.width >= 375 ? 340 : 290

  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : cardHeight }

  const images: ImageDescriptor[] = useMemo(
    () =>
      props.images
        .map(image => {
          if (!image.height || !image.width || !image.image_url) {
            // something is very wrong
            return null
          }
          const { width, height } = fitInside(embeddedCardBoundingBox, image)
          return {
            width,
            height,
            url: createGeminiUrl({
              imageURL: image.image_url.replace(":version", "normalized"),
              width,
              height,
            }),
            deepZoom: image.deepZoom,
          }
        })
        .filter(Boolean),
    [props.images]
  )

  const context = useNewImageCarouselContext({ images })

  if (images.length === 0) {
    return null
  }

  return (
    <ImageCarouselContext.Provider value={context}>
      <Flex>
        <ImageCarouselEmbedded />
        {images.length > 1 && <PaginationDots />}
        {context.state.fullScreenState !== "none" && <ImageCarouselFullScreen />}
      </Flex>
    </ImageCarouselContext.Provider>
  )
})

function PaginationDots() {
  const { images } = useContext(ImageCarouselContext)
  return (
    <>
      <Spacer mb={2} />
      <Flex flexDirection="row" justifyContent="center">
        {images.map((_, index) => (
          <PaginationDot key={index} diameter={5} index={index} />
        ))}
      </Flex>
    </>
  )
}

export const PaginationDot = observer(({ diameter, index }: { diameter: number; index: number }) => {
  const { state } = useContext(ImageCarouselContext)
  const opacity = useSpringValue(state.imageIndex === index ? 1 : 0.1)

  return (
    <Animated.View
      style={{
        marginHorizontal: diameter * 0.8,
        borderRadius: diameter / 2,
        width: diameter,
        height: diameter,
        backgroundColor: "black",
        opacity,
      }}
    />
  )
})

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  images: graphql`
    fragment ImageCarousel_images on Image @relay(plural: true) {
      image_url: imageURL
      width
      height
      deepZoom {
        image: Image {
          tileSize: TileSize
          url: Url
          format: Format
          size: Size {
            width: Width
            height: Height
          }
        }
      }
    }
  `,
})
