import { useSpace } from "@artsy/palette-mobile"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtworkListItem } from "app/Scenes/ArtworkLists/ArtworkListItem"
import { savedArtworksDummyData } from "app/Scenes/ArtworkLists/dummyData"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"

export const ArtworkLists = () => {
  const space = useSpace()
  const artworkListsColCount = useArtworkListsColCount()
  const artworkSections = savedArtworksDummyData.map((artworkList) => ({
    key: artworkList.id,
    content: <ArtworkListItem artworkList={artworkList} />,
  }))

  return (
    <StickyTabPageFlatList
      style={{ paddingTop: space(2) }}
      data={artworkSections}
      numColumns={artworkListsColCount}
      keyExtractor={(item, index) => String(item.id || index)}
    />
  )
}
