import { captureMessage } from "@sentry/react-native"
import { ImageCarousel_images$data } from "__generated__/ImageCarousel_images.graphql"
import { createGeminiUrl } from "app/Components/OpaqueImageView/createGeminiUrl"
import { isPad } from "app/utils/hardware"
import { Flex } from "palette"
import React, { useMemo } from "react"
import { PixelRatio } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { ImageCarouselFullScreen } from "./FullScreen/ImageCarouselFullScreen"
import { fitInside } from "./geometry"
import {
  ImageCarouselContext,
  ImageDescriptor,
  useNewImageCarouselContext,
} from "./ImageCarouselContext"
import { ImageCarouselEmbedded } from "./ImageCarouselEmbedded"
import { IndicatorType, PaginationIndicator } from "./ImageCarouselPaginationIndicator"

export interface CarouselImageDescriptor extends ImageDescriptor {
  imageVersions?: string[]
}
interface MappedImageDescriptor extends Pick<ImageDescriptor, "deepZoom"> {
  width: number
  height: number
  url: string
}

export interface ImageCarouselProps {
  /** CarouselImageDescriptor for when you want to display local images */
  images: ImageCarousel_images$data | CarouselImageDescriptor[]
  cardHeight: number
  onImageIndexChange?: (imageIndex: number) => void
  paginationIndicatorType?: IndicatorType
  onImagePressed?: () => void
}

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel = (props: ImageCarouselProps) => {
  const screenDimensions = useScreenDimensions()
  const { cardHeight, onImageIndexChange } = props

  const embeddedCardBoundingBox = {
    width: screenDimensions.width,
    height: isPad() ? 460 : cardHeight,
  }

  // TODO:- Deepzoom for local images?
  const disableDeepZoom = props.images.some((image) => isALocalImage(image.url))

  const images: ImageDescriptor[] = useMemo(() => {
    let result = props.images
      .map((image): MappedImageDescriptor | null => {
        if (!image.height || !image.width || !image.url) {
          // something is very wrong
          return null
        }
        const { width, height } = fitInside(embeddedCardBoundingBox, image as MappedImageDescriptor)
        return {
          width,
          height,
          url:
            isALocalImage(image.url) || !imageHasVersions(image)
              ? image.url
              : createGeminiUrl({
                  imageURL: image.url.replace(
                    ":version",
                    getBestImageVersionForThumbnail(image.imageVersions as string[])
                  ),
                  // upscale to match screen resolution
                  width: width * PixelRatio.get(),
                  height: height * PixelRatio.get(),
                }),
          deepZoom: image.deepZoom,
        }
      })
      .filter((mappedImage): mappedImage is MappedImageDescriptor => Boolean(mappedImage))

    if (!disableDeepZoom) {
      if (result.some((image) => !image.deepZoom)) {
        const filteredResult = result.filter((image) => image.deepZoom)
        if (filteredResult.length === 0) {
          result = [result[0]]
        } else {
          result = filteredResult
        }
      }
    }

    return result
  }, [props.images])

  const context = useNewImageCarouselContext({ images, onImageIndexChange })

  context.fullScreenState.useUpdates()

  if (images.length === 0) {
    return null
  }

  return (
    <ImageCarouselContext.Provider value={context}>
      <Flex>
        <ImageCarouselEmbedded cardHeight={cardHeight} disableFullScreen={disableDeepZoom} />
        {images.length > 1 && <PaginationIndicator indicatorType={props.paginationIndicatorType} />}
        {context.fullScreenState.current !== "none" && <ImageCarouselFullScreen />}
      </Flex>
    </ImageCarouselContext.Provider>
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

export const isALocalImage = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return false
  }
  const regex = new RegExp("^[.|/|asset://|file:///].*.[/.](gif|jpg|jpeg|bmp|webp|png)$")
  return regex.test(imageUrl)
}

// we used to rely on there being a "normalized" version of every image, but that
// turns out not to be the case, so in those rare situations we order the image versions
// by size and pick the largest avaialable. These large images will then be resized by
// gemini for the actual thumbnail we fetch.
function getBestImageVersionForThumbnail(imageVersions: readonly string[]) {
  for (const size of imageVersionsSortedBySize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    captureMessage("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come accross an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}

const imageHasVersions = (image: CarouselImageDescriptor | ImageCarousel_images$data[number]) => {
  return image.imageVersions && image.imageVersions.length
}
