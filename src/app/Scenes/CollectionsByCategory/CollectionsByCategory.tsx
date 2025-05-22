import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { BodyWithSuspense } from "app/Scenes/CollectionsByCategory/Body"
import { FooterWithSuspense } from "app/Scenes/CollectionsByCategory/Footer"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"

type CollectionsByCategoriesNavigationRoutes = {
  collections: {
    category: string
    entityID: string
    homeViewSectionId: string
  }
}

export type CollectionsByCategoriesRouteProp = RouteProp<
  CollectionsByCategoriesNavigationRoutes,
  "collections"
>

export const CollectionsByCategory: FC = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()

  const category = params.category

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.collectionsCategory,
        context_screen_owner_slug: category,
      })}
    >
      <Screen>
        <Screen.Header onBack={goBack} title={category} animated />
        <Screen.Body fullwidth flex={1}>
          <Screen.ScrollView>
            <Flex gap={4}>
              <BodyWithSuspense />

              <FooterWithSuspense homeViewSectionId={params.homeViewSectionId} />
            </Flex>
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
