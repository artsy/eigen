import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"

type CollectionsByCategoriesNavigationRoutes = {
  collections: { props: { category: string } }
}

export const CollectionsByCategory: FC = () => {
  const { params } = useRoute<RouteProp<CollectionsByCategoriesNavigationRoutes, "collections">>()

  console.log(params)

  const category = params?.props.category ?? ""

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Collections" animated />
      <Screen.Body fullwidth px={2}>
        <Screen.ScrollView>
          <Flex>
            <Text>{category}</Text>
          </Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}
