import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"

export const SellScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedRoutesParams>>()

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Text variant="lg-display">Sell</Text>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.navigate("Artwork", {
            artworkID: "banksy-choose-your-weapon-lemon-18",
          })
        }}
      >
        Go to Artwork
      </Button>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.navigate("Artist", {
            artistID: "banksy",
          })
        }}
      >
        Go to Artist
      </Button>
    </Flex>
  )
}
