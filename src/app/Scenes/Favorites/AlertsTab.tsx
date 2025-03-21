import { Flex, Text } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

export const AlertsTab = () => {
  return (
    <ScrollView>
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text variant="lg-display">Alerts</Text>
      </Flex>
    </ScrollView>
  )
}
