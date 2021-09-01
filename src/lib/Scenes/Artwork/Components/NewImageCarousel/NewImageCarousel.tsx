import { NewImageCarousel_images } from "__generated__/NewImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import compact from "lodash/compact"
import { Flex } from "palette"
import React, { useMemo } from "react"
import { FlatList, PixelRatio } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import OpaqueImageView from "../../../../Components/OpaqueImageView/OpaqueImageView"
import { fitInside, getBestImageVersionForThumbnail, getMeasurements } from "./helpers"

interface NewImageCarouselProps {
  images: NewImageCarousel_images
}

export const NewImageCarousel: React.FC<NewImageCarouselProps> = ({ images: rawImages }) => {
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

  const measurements = useMemo(
    () =>
      getMeasurements({
        // typescript is finding troubles finding out that height and width can not be null at this point
        // @ts-ignore
        images: images.map((image) => ({ height: image.height, width: image.width })),
        boundingBox: embeddedCardBoundingBox,
      }),
    [images]
  )

  return (
    <Flex>
      <FlatList
        data={images}
        // contentContainerStyle={{ flex: 1, height: 100, width: 100 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        keyExtractor={(item) => item.url}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const { cumulativeScrollOffset, ...styles } = measurements[index]
          return (
            <Flex>
              <OpaqueImageView
                useRawURL
                imageURL={item?.url}
                height={styles.height}
                width={styles.width}
                // style={{ width: item.width, height: item.height }}
                // make sure first image loads first
                highPriority={index === 0}
                style={[styles, images.length === 1 ? { marginTop: 0, marginBottom: 0 } : {}]}
              />
            </Flex>
          )
        }}
      />
    </Flex>
  )
}

export const NewImageCarouselFragmentContainer = createFragmentContainer(NewImageCarousel, {
  images: graphql`
    fragment NewImageCarousel_images on Image @relay(plural: true) {
      url: imageURL
      width
      height
      aspectRatio
      imageVersions
    }
  `,
})
