import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { useFavoritesScrenTracking } from "app/Scenes/Favorites/useFavoritesTracking"

export const SavesTab = () => {
  useFavoritesScrenTracking(OwnerType.favoritesSaves)

  return (
    <Flex flex={1}>
      <ArtworkLists isTab={false} isFavorites={true} />
    </Flex>
  )
}
