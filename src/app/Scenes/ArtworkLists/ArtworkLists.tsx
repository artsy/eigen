import { useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtworksListsItem } from "app/Scenes/ArtworkLists/ArtworkListsItem"
import { savedArtworksDummyData } from "app/Scenes/ArtworkLists/dummyData"

export const ArtworkLists = () => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const artworkSections = savedArtworksDummyData.map((artwork) => ({
    key: artwork.id,
    content: <ArtworksListsItem artwork={artwork} />,
  }))

  const isPad = width > 600

  return (
    <StickyTabPageFlatList
      contentContainerStyle={{ paddingVertical: space(2) }}
      style={{ paddingHorizontal: space(2) }}
      data={artworkSections}
      numColumns={isPad ? 3 : 2}
      keyExtractor={(item, index) => String(item?.artist?.internalID || index)}
    />
  )
}
