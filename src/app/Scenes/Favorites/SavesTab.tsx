import { Flex, Text } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

export const SavesTab = () => {
  return (
    <ScrollView>
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text variant="lg-display">Saves</Text>
      </Flex>
    </ScrollView>
  )
}
