import { Flex, Text, Separator } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { isTablet } from "react-native-device-info"

export const Footer: React.FC = () => {
  return (
    <Flex mx={2} alignItems={isTablet() ? "center" : undefined}>
      <Separator />

      <Flex my={2}>
        <Text variant="md">Gallerist or Art Dealer?</Text>

        <Text variant="xs" color="black60">
          <Text
            variant="xs"
            color="black60"
            onPress={() => navigate("https://partners.artsy.net/")}
            style={{ textDecorationLine: "underline" }}
          >
            Become a partner
          </Text>{" "}
          to access the world’s largest online art marketplace.
        </Text>
      </Flex>

      <Separator />
    </Flex>
  )
}
