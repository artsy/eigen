import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"

type CollectionsNavigationRoutes = {
  collections: { props: { category: string } }
}

export const Collections: FC = () => {
  const { params } = useRoute<RouteProp<CollectionsNavigationRoutes, "collections">>()

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
