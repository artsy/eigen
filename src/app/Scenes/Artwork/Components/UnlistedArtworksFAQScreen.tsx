import { Box, Button, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { ScrollView } from "react-native"

export const UnlistedArtworksFAQScreen = () => {
  return (
    <Screen>
      <Screen.Body>
        <ScrollView>
          <Box my={4}>
            <Join separator={<Spacer y={2} />}>
              <Text>
                Private listings are shared by galleries with select collectors. You need a link to
                find them—they won’t appear in searches on Artsy. Use the heart icon to add a
                private listing to your Saves, for easy access.
              </Text>

              <Button onPress={() => goBack()} block>
                OK
              </Button>
            </Join>
          </Box>
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
