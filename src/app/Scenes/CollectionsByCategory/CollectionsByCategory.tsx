import { OwnerType } from "@artsy/cohesion"
import { Screen } from "@artsy/palette-mobile"
import { CollectionsByCategoryBodyWithSuspense } from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryBody"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"

export const CollectionsByCategory: FC = () => {
  const { slug, title } = useCollectionsByCategoryParams()

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.collectionsCategory,
        context_screen_owner_slug: slug,
      })}
    >
      <Screen>
        <Screen.Header onBack={goBack} title={title} animated />
        <Screen.Body fullwidth flex={1}>
          <CollectionsByCategoryBodyWithSuspense />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
