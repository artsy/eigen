import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, useSpace } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { BodyWithSuspense } from "app/Scenes/CollectionsByCategory/Body"
import { FooterWithSuspense } from "app/Scenes/CollectionsByCategory/Footer"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { FC } from "react"

type CollectionsByCategoriesNavigationRoutes = {
  collections: {
    props: {
      category: string
      entityID: string
      homeViewSectionId: string
    }
  }
}

export type CollectionsByCategoriesRouteProp = RouteProp<
  CollectionsByCategoriesNavigationRoutes,
  "collections"
>

export const CollectionsByCategory: FC = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const space = useSpace()

  const category = params.props.category

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.CollectionsCategory,
    context_screen_owner_slug: category,
    context_screen_owner_type: OwnerType.collectionsCategory,
  }

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <Screen>
        <Screen.Header onBack={goBack} title={category} animated />
        <Screen.Body fullwidth flex={1}>
          <Screen.ScrollView>
            <Flex gap={space(4)}>
              <BodyWithSuspense />

              <FooterWithSuspense homeViewSectionId={params.props.homeViewSectionId} />
            </Flex>
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTracking>
  )
}
