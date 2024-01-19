import { Flex } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { ImageCarousel_figures$data } from "__generated__/ImageCarousel_figures.graphql"
import { createGeminiUrl } from "app/Components/OpaqueImageView/createGeminiUrl"
import { useLocalImages } from "app/utils/LocalImageStore"
import { useScreenDimensions } from "app/utils/hooks"
import { guardFactory } from "app/utils/types/guardFactory"
import { useMemo } from "react"
import { PixelRatio, Platform } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { ImageCarouselFullScreen } from "./FullScreen/ImageCarouselFullScreen"
import { ImageCarouselFullScreenAndroid } from "./FullScreen/ImageCarouselFullScreenAndroid"
import {
  ImageCarouselContext,
  ImageCarouselImage,
  ImageCarouselVideo,
  ImageDescriptor,
  useNewImageCarouselContext,
} from "./ImageCarouselContext"
import { ImageCarouselEmbedded } from "./ImageCarouselEmbedded"
import { IndicatorType, PaginationIndicator } from "./ImageCarouselPaginationIndicator"
import { fitInside } from "./geometry"

export interface CarouselImageDescriptor extends ImageDescriptor {
  imageVersions?: string[]
}
interface MappedImageDescriptor extends Pick<ImageDescriptor, "deepZoom"> {
  width: number
  height: number
  url: string
  largeImageURL: string | null
}

export interface ImageCarouselProps {
  /** CarouselImageDescriptor for when you want to display local images */
  staticImages?: CarouselImageDescriptor[]
  figures?: ImageCarousel_figures$data
  setVideoAsCover?: boolean
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
  const { cardHeight, onImageIndexChange, setVideoAsCover } = props
  const { images, videos, disableDeepZoom } = useImageCarouselMedia(props)
  const context = useNewImageCarouselContext({
    images,
    videos,
    setVideoAsCover,
    onImageIndexChange,
  })

  context.fullScreenState.useUpdates()

  if (context.media.length === 0) {
    return null
  }

  return (
    <ImageCarouselContext.Provider value={context}>
      <Flex>
        <ImageCarouselEmbedded cardHeight={cardHeight} disableFullScreen={disableDeepZoom} />

        {context.media.length > 1 && (
          <PaginationIndicator indicatorType={props.paginationIndicatorType} />
        )}

        {context.fullScreenState.current !== "none" && <ImagesCarousel />}
      </Flex>
    </ImageCarouselContext.Provider>
  )
}

export const ImagesCarousel = () => {
  if (Platform.OS === "ios") {
    return <ImageCarouselFullScreen />
  }

  return <ImageCarouselFullScreenAndroid />
}

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  figures: graphql`
    fragment ImageCarousel_figures on ArtworkFigures @relay(plural: true) {
      ... on Image {
        __typename
        internalID
        blurhash
        url
        largeImageURL: url(version: "larger")
        resized(width: 590, height: 590, version: ["normalized", "larger", "large"]) {
          src
        }
        width
        height
        imageVersions
        versions
        isDefault
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
      ... on Video {
        __typename
        # Unfortunately, in MP, these types are ambiguous within the union
        # so we have to alias them to avoid a conflict.
        videoWidth: width
        videoHeight: height
        playerUrl
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
    if (imageVersions?.includes(size)) {
      return size
    }
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come accross an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}

const useImageCarouselMedia = (
  props: ImageCarouselProps
): {
  images: ImageCarouselImage[]
  videos: ImageCarouselVideo[]
  disableDeepZoom: boolean | undefined
} => {
  const screenDimensions = useScreenDimensions()

  const embeddedCardBoundingBox = {
    width: screenDimensions.width,
    height: isTablet() ? 460 : props.cardHeight,
  }

  const imageFigures = props.staticImages?.length
    ? props.staticImages
    : props.figures?.filter(guardFactory("__typename", "Image"))

  const videoFigures = props.figures?.filter(guardFactory("__typename", "Video"))

  const localImages = useLocalImages(imageFigures)

  const disableDeepZoom = imageFigures?.some(
    (image, index) => isALocalImage(image.url) || localImages?.[index]
  )

  const fallbackSize = screenDimensions.width

  const images = useMemo(() => {
    const mappedImages =
      imageFigures?.map((image, i) => {
        const imageWidth = localImages?.[i]?.width || image.width
        const imageHeight = localImages?.[i]?.height || image.height

        if (!imageWidth || !imageHeight) {
          if (!__DEV__) {
            captureMessage("ImageCarousel: image width or height is missing.")
          }
          console.log("ImageCarousel: image width or height is missing", image)
        }

        return {
          ...image,
          url: localImages?.[i]?.path || image.url,
          width: imageWidth || fallbackSize,
          height: imageHeight || fallbackSize,
        }
      }) ??
      props.staticImages ??
      []

    let result = mappedImages
      .map((image, index) => {
        const { width, height } = fitInside(embeddedCardBoundingBox, image as MappedImageDescriptor)

        const url = (() => {
          if (!image.url || localImages?.[index]) {
            return image.url
          }

          return createGeminiUrl({
            imageURL: image.url.replace(
              ":version",
              getBestImageVersionForThumbnail(image.imageVersions as string[])
            ),
            // upscale to match screen resolution
            width: width * PixelRatio.get(),
            height: height * PixelRatio.get(),
          })
        })()

        const largeImageURL = localImages?.[index]
          ? image.url
          : image.largeImageURL ?? image.url ?? null

        return {
          ...image,
          deepZoom: image?.deepZoom,
          height,
          largeImageURL,
          url,
          width,
        }
      })
      .filter((mappedImage) => {
        return Boolean(mappedImage)
      })

    if (!disableDeepZoom) {
      if (result.some((image) => !image?.deepZoom)) {
        const filteredResult = result.filter((image) => image?.deepZoom)
        if (filteredResult.length === 0) {
          result = [result[0]]
        } else {
          result = filteredResult
        }
      }
    }

    // Filter out (local) images that are not loaded yet
    result = result.filter((image) => image?.width && image?.height)

    return result
  }, [props.staticImages, imageFigures, localImages]) as ImageCarouselImage[]

  // Map video props to the same format thats used for images
  const videos = useMemo(() => {
    if (!videoFigures) {
      return []
    }

    return videoFigures.map((video) => ({
      ...video,
      width: video.videoWidth,
      height: video.videoHeight,
      url: video.playerUrl,
    }))
  }, [videoFigures]) as ImageCarouselVideo[]

  return {
    disableDeepZoom,
    images: images ?? [],
    videos,
  }
}
