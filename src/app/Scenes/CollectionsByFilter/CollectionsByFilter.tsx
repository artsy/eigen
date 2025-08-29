import { OwnerType } from "@artsy/cohesion"
import { Screen, Spacer } from "@artsy/palette-mobile"
import { CollectionsByCategoryFooterWithSuspense } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryFooter"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { CollectionsByFilterBodyWithSuspense } from "app/Scenes/CollectionsByFilter/CollectionsByFilterBody"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"

/**
 * Variation of CollectionsByCategory screen but instead of rendering curated marketing collections
 * renders artworks with filters
 */
export const CollectionsByFilter: FC = () => {
  const { slug, title } = useCollectionsByCategoryParams()

  const items = [
    { Component: CollectionsByFilterBodyWithSuspense },
    { Component: CollectionsByCategoryFooterWithSuspense },
  ]

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
          <Screen.FlatList
            data={items}
            keyExtractor={(_, i) => `element_${i}`}
            renderItem={({ item: { Component } }) => <Component />}
            ItemSeparatorComponent={() => <Spacer y={4} />}
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
