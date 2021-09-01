import { NewImagesCarousel_images } from "__generated__/NewImagesCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import compact from "lodash/compact"
import React, { useMemo } from "react"
import { PixelRatio } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
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
    <NewImagesCarouselStore.Provider>
      <NewImagesCarouselEmbedded images={images} />
    </NewImagesCarouselStore.Provider>
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
