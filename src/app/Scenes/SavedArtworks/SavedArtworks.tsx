import { OwnerType } from "@artsy/cohesion"
import { BackButton, Flex, Screen, useSpace } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

export const SavedArtworks = () => {
  const space = useSpace()

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.saves })}
    >
      <Screen>
        <Screen.AnimatedHeader
          leftElements={
            <Flex flexDirection="row" alignItems="center" gap={space(1)}>
              <BackButton onPress={goBack} />
            </Flex>
          }
          title="Saves"
        />
        <Screen.StickySubHeader title="Saves" />
        <Screen.Body fullwidth>
          <ArtworkLists isTab={false} />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
