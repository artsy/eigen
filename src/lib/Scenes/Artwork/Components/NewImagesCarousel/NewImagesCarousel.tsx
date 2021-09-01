import { NewImagesCarousel_images } from "__generated__/NewImagesCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import compact from "lodash/compact"
import { Flex, Spacer } from "palette"
import React, { useMemo } from "react"
import { Animated, PixelRatio } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useSpringValue } from "../ImageCarousel/useSpringValue"
import { fitInside, getBestImageVersionForThumbnail } from "./helpers"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"
import { NewImagesCarouselEmbedded } from "./NewImagesCarouselEmbedded"

interface NewImagesCarouselProps {
  images: NewImagesCarousel_images
}

export const NewImagesCarousel: React.FC<NewImagesCarouselProps> = ({ images: rawImages }) => {
  const screenDimensions = useScreenDimensions()
  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : 340 }

  const images = useMemo(() => {
    const result = rawImages
      .map((image) => {
        if (!image.height || !image.width || !image.url) {
          // for some reason gemini returned missing values
          return null
        }
        const { width, height } = fitInside(embeddedCardBoundingBox, { width: image.width, height: image.height })
        return {
          width,
          height,
          url: createGeminiUrl({
            imageURL: image.url.replace(":version", getBestImageVersionForThumbnail(compact(image.imageVersions))),
            // upscale to match screen resolution
            width: width * PixelRatio.get(),
            height: height * PixelRatio.get(),
          }),
        }
      })
      .filter(Boolean)

    return result
  }, [rawImages])

  return (
    <NewImagesCarouselStore.Provider initialData={{ images }}>
      <NewImagesCarouselEmbedded images={images} />
      {images.length > 1 && <PaginationDots />}
    </NewImagesCarouselStore.Provider>
  )
}

const PaginationDots = () => {
  const images = NewImagesCarouselStore.useStoreState((state) => state.images)

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

const PaginationDot = ({ diameter, index }: { diameter: number; index: number }) => {
  const imageIndex = NewImagesCarouselStore.useStoreState((state) => state.imageIndex)
  const opacity = useSpringValue(imageIndex === index ? 1 : 0.1)

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

export const NewImagesCarouselFragmentContainer = createFragmentContainer(NewImagesCarousel, {
  images: graphql`
    fragment NewImagesCarousel_images on Image @relay(plural: true) {
      url: imageURL
      width
      height
      aspectRatio
      imageVersions
    }
  `,
})
