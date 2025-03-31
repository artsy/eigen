import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { ProvideScreenTracking, Schema } from "app/utils/track"

export const SavesTab = () => {
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FavoritesSaves,
        context_screen_owner_type: OwnerType.favorites,
      }}
    >
      <Flex flex={1} mt={-2}>
        <ArtworkLists isTab={false} isFavorites={true} />
      </Flex>
    </ProvideScreenTracking>
  )
}
