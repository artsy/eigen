import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

export const HomeSectionScreen = () => {
  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Screen Title" />

      <Screen.Body fullwidth>
        <Screen.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Flex backgroundColor="red10" flex={1} p={2}>
            <Text variant="lg-display">Content</Text>
          </Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}
