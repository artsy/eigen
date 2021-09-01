import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex } from "palette"
import React, { useMemo } from "react"
import { FlatList, ViewToken } from "react-native"
import { getMeasurements } from "./helpers"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"

interface NewImagesCarouselEmbeddedProps {
  images: Array<{
    width: number
    height: number
    url: string
  } | null>
}

export interface ViewableItems {
  viewableItems?: ViewToken[]
}

export const NewImagesCarouselEmbedded: React.FC<NewImagesCarouselEmbeddedProps> = ({ images }) => {
  const screenDimensions = useScreenDimensions()
  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : 340 }
  const setImageIndex = NewImagesCarouselStore.useStoreActions((actions) => actions.setImageIndex)

  const viewableItemsChangedRef = React.useRef(({ viewableItems }: ViewableItems) => {
    // We would like to only update the visible image index when the transition finishes
    if (viewableItems?.length === 1 && typeof viewableItems[0].index === "number") {
      setImageIndex(viewableItems[0].index)
    }
  })

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
    <>
      <FlatList
        data={images}
        // contentContainerStyle={{ flex: 1, height: 100, width: 100 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        keyExtractor={(item) => item.url}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChangedRef.current}
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
    </>
  )
}
