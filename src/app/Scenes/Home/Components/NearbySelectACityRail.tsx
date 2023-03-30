import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Button } from "palette"

export const NearbySelectACityRail: React.FC = () => {
  return (
    <Flex mt={2} flex={1} alignItems="center" justifyContent="center">
      <Text>Select a city to see nearby shows and fairs</Text>
      <Spacer y={2} />
      <Button
        onPress={() => {
          navigate("nearby/city-picker")
        }}
      >
        Select a city
      </Button>
    </Flex>
  )
}
