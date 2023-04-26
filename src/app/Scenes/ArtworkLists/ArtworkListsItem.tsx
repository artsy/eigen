import { Flex } from "@artsy/palette-mobile"
import { FourUpImageLayout } from "app/Scenes/ArtworkLists/FourUpImageLayout"
import { StackedImageLayout } from "app/Scenes/ArtworkLists/StackedImageLayout"

interface ArtworksListsItemProps {
  artwork: {
    id: string
    type: string
    imageUrls: string[]
  }
}

export const ArtworksListsItem = ({ artwork }: ArtworksListsItemProps) => {
  return (
    <Flex mr={2} mb={2}>
      {artwork.type === "SavedArtworks" ? (
        <FourUpImageLayout />
      ) : (
        <StackedImageLayout imageURLs={artwork.imageUrls} />
      )}
    </Flex>
  )
}
