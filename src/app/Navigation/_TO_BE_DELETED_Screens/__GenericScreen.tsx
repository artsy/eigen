import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationRoutesParams } from "app/Navigation/Navigation"

export const GenericScreen: React.FC<{ title: string }> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<NavigationRoutesParams>>()
  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Text variant="lg-display">{title}</Text>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.goBack()
        }}
      >
        Go to Home
      </Button>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.navigate("Artwork", { artworkID: "banksy-choose-your-weapon-lemon-18" })
        }}
      >
        Go to Artwork Page
      </Button>
    </Flex>
  )
}
