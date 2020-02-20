import { Flex, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext, useMemo } from "react"
import { Animated, PixelRatio } from "react-native"
import { Sentry } from "react-native-sentry"
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
export const ImageCarousel = (props: ImageCarouselProps) => {
  const screenDimensions = useScreenDimensions()
  // The logic for cardHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  const cardHeight = screenDimensions.width >= 375 ? 340 : 290

  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : cardHeight }

  const images: ImageDescriptor[] = useMemo(() => {
    let result = props.images
      .map(image => {
        if (!image.height || !image.width || !image.url) {
          // something is very wrong
          return null
        }
        const { width, height } = fitInside(embeddedCardBoundingBox, image)
        return {
          width,
          height,
          url: createGeminiUrl({
            imageURL: image.url.replace(":version", getBestImageVersionForThumbnail(image.imageVersions)),
            // upscale to match screen resolution
            width: width * PixelRatio.get(),
            height: height * PixelRatio.get(),
          }),
          deepZoom: image.deepZoom,
        }
      })
      .filter(Boolean)

    if (result.some(image => !image.deepZoom)) {
      if (!__DEV__) {
        Sentry.captureMessage(`No deep zoom for at least one image on artwork (see breadcrumbs for artwork slug)`)
      }
      const filteredResult = result.filter(image => image.deepZoom)
      if (filteredResult.length === 0) {
        result = [result[0]]
      } else {
        result = filteredResult
      }
    }

    return result
  }, [props.images])

  const context = useNewImageCarouselContext({ images })

  context.fullScreenState.useUpdates()

  if (images.length === 0) {
    return null
  }

  return (
    <ImageCarouselContext.Provider value={context}>
      <Flex>
        <ImageCarouselEmbedded />
        {images.length > 1 && <PaginationDots />}
        {context.fullScreenState.current !== "none" && <ImageCarouselFullScreen />}
      </Flex>
    </ImageCarouselContext.Provider>
  )
}

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

export const PaginationDot = ({ diameter, index }: { diameter: number; index: number }) => {
  const { imageIndex } = useContext(ImageCarouselContext)
  imageIndex.useUpdates()
  const opacity = useSpringValue(imageIndex.current === index ? 1 : 0.1)

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
}

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  images: graphql`
    fragment ImageCarousel_images on Image @relay(plural: true) {
      url: imageURL
      width
      height
      imageVersions
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

const imageVersionsSortedBySize = ["normalized", "larger", "large", "medium", "small"] as const

// we used to rely on there being a "normalized" version of every image, but that
// turns out not to be the case, so in those rare situations we order the image versions
// by size and pick the largest avaialable. These large images will then be resized by
// gemini for the actual thumnail we fetch.
function getBestImageVersionForThumbnail(imageVersions: readonly string[]) {
  for (const size of imageVersionsSortedBySize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    Sentry.captureMessage("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come accross an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}
