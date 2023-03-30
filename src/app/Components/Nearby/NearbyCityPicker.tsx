import { Text } from "@artsy/palette-mobile"
import { Button } from "palette"

export const NearbyCityPicker: React.FC = () => {
  return (
    <>
      <Text>Select a city to see nearby shows and fairs</Text>
      <Button
        onPress={() => {
          console.log("here is where i should show the city picker")
        }}
      >
        Select a city
      </Button>
    </>
  )
}
