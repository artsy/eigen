import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

export const SavesTab = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.favoritesSaves,
      })}
    >
      <Flex flex={1}>
        <ArtworkLists isTab={false} isFavorites={true} />
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
