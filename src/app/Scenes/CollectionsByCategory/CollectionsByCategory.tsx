import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { CollectionsByCategoryBodyWithSuspense } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryBody"
import { CollectionsByCategoryFooterWithSuspense } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryFooter"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"

export type CollectionsByCategoriesRouteProp = RouteProp<
  {
    collections: {
      slug: string
      title: string
    }
  },
  "collections"
>

export const CollectionsByCategory: FC = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const slug = params.slug
  const title = params.title

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
          <Screen.ScrollView>
            <Flex gap={4}>
              <CollectionsByCategoryBodyWithSuspense />

              <CollectionsByCategoryFooterWithSuspense />
            </Flex>
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
