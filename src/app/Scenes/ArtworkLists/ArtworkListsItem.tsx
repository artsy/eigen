import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { FourUpImageLayout } from "app/Scenes/ArtworkLists/FourUpImageLayout"
import { StackedImageLayout } from "app/Scenes/ArtworkLists/StackedImageLayout"
import { isPad } from "app/utils/hardware"

interface ArtworksListsItemProps {
  artwork: {
    id: string
    type: string
    label: string
    imageUrls: string[]
  }
}

const LABEL_HEIGHT = 50

export const ArtworksListsItem = ({ artwork }: ArtworksListsItemProps) => {
  const space = useSpace()
  const screen = useScreenDimensions()
  const width = screen.width - space(4)
  const numColumns = isPad() ? 3 : 2
  const imageSize = (width + space(2)) / numColumns - space(2)

  return (
    <Flex width={imageSize} height={imageSize + LABEL_HEIGHT} mr={2} mb={2}>
      <Flex flex={1} flexDirection="column" justifyContent="space-between">
        {artwork.type === "Saved" ? (
          <FourUpImageLayout imageURLs={artwork.imageUrls} imageSize={imageSize} />
        ) : (
          <StackedImageLayout imageURLs={artwork.imageUrls} imageSize={imageSize} />
        )}

        <Flex>
          <Text variant="xs">{artwork.label}</Text>
          <Text variant="xs" color="black60">
            {artwork.imageUrls.length} Artworks
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
