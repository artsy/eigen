import { useSpace } from "@artsy/palette-mobile"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtworksListsItem } from "app/Scenes/ArtworkLists/ArtworkListsItem"
import { savedArtworksDummyData } from "app/Scenes/ArtworkLists/dummyData"
import { isPad } from "app/utils/hardware"

export const ArtworkLists = () => {
  const space = useSpace()
  const artworkSections = savedArtworksDummyData.map((artwork) => ({
    key: artwork.id,
    content: <ArtworksListsItem artwork={artwork} />,
  }))

  return (
    <StickyTabPageFlatList
      style={{ paddingTop: space(2) }}
      data={artworkSections}
      numColumns={isPad() ? 3 : 2}
      keyExtractor={(item, index) => String(item?.artist?.internalID || index)}
    />
  )
}
