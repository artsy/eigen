import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { BodyWithSuspense } from "app/Scenes/CollectionsByCategory/Body"
import { Footer } from "app/Scenes/CollectionsByCategory/Footer"
import { getTitleForCategory } from "app/Scenes/Search/components/ExploreByCategory/constants"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type CollectionsByCategoriesRouteProp = RouteProp<
  {
    collections: {
      category: string
    }
  },
  "collections"
>

export const CollectionsByCategory: FC = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = decodeURI(params.category)
  const insets = useSafeAreaInsets()

  const title = getTitleForCategory(category)

  const bottomPadding =
    Platform.OS === "ios" ? Math.max(insets.bottom + 60, 80) : Math.max(insets.bottom + 40, 60)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.collectionsCategory,
        context_screen_owner_slug: category,
      })}
    >
      <Screen>
        <Screen.Header onBack={goBack} title={title} animated />
        <Screen.Body fullwidth flex={1}>
          <Screen.ScrollView contentContainerStyle={{ paddingBottom: bottomPadding }}>
            <Flex gap={4}>
              <BodyWithSuspense />

              <Footer />
            </Flex>
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
