import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { useFavoritesScrenTracking } from "app/Scenes/Favorites/useFavoritesTracking"

export const SavesTab = () => {
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)
  useFavoritesScrenTracking(OwnerType.favoritesSaves)

  return (
    <Flex flex={1}>
      <ArtworkLists isTab={false} isFavorites={true} style={{ paddingTop: headerHeight }} />
    </Flex>
  )
}
