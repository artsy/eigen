import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { FourUpImageLayout } from "app/Scenes/ArtworkLists/FourUpImageLayout"
import { StackedImageLayout } from "app/Scenes/ArtworkLists/StackedImageLayout"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"

interface ArtworksListsItemProps {
  artworkList: {
    id: string
    type: string
    label: string
    imageUrls: string[]
  }
}

const LABEL_HEIGHT = 45

export const ArtworkListItem = ({ artworkList }: ArtworksListsItemProps) => {
  const space = useSpace()
  const screen = useScreenDimensions()
  const offset = space(2)
  const numColumns = useArtworkListsColCount()
  const allOffsets = offset * (numColumns + 1)
  const containerWidth = screen.width - allOffsets
  const itemWidth = containerWidth / numColumns

  return (
    <Flex
      justifyContent="space-between"
      width={itemWidth}
      height={itemWidth + LABEL_HEIGHT}
      mr={2}
      mb={2}
    >
      {artworkList.type === "default" ? (
        <FourUpImageLayout imageURLs={artworkList.imageUrls} cardWidth={itemWidth} />
      ) : (
        <StackedImageLayout imageURLs={artworkList.imageUrls} cardWidth={itemWidth} />
      )}

      <Flex>
        <Text variant="xs" numberOfLines={1}>
          {artworkList.label}
        </Text>
        <Text variant="xs" color="black60" numberOfLines={1}>
          {artworkList.imageUrls.length}{" "}
          {artworkList.imageUrls.length === 1 ? "Artwork" : "Artworks"}
        </Text>
      </Flex>
    </Flex>
  )
}
