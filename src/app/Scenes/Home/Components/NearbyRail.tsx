import { Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Button } from "palette"

export const NearbyRail: React.FC = () => {
  return (
    <>
      <Text>Select a city to see nearby shows and fairs</Text>
      <Button
        onPress={() => {
          navigate("nearby/city-picker")
        }}
      >
        Select a city
      </Button>
    </>
  )
}
