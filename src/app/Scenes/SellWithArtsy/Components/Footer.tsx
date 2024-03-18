import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Flex, Spacer, Text, Separator, Button } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { isTablet } from "react-native-device-info"

export const Footer: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const buttonText = "Start Selling"

  return (
    <Flex mx={2} alignItems={isTablet() ? "center" : undefined}>
      <Text variant="lg-display" textAlign="center">
        Meet your new art advisor.{"\n"}It’s Artsy.
      </Text>

      <Spacer y={2} />

      <Button
        testID="footer-consign-CTA"
        block={!isTablet()}
        minWidth={isTablet() ? "50%" : undefined}
        onPress={() => {
          onConsignPress(tracks.consignArgs(buttonText))
        }}
      >
        {buttonText}
      </Button>

      <Spacer y={4} />

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
            {" "}
            Become a partner
          </Text>{" "}
          to access the world’s largest online art marketplace.
        </Text>
      </Flex>
    </Flex>
  )
}

const tracks = {
  consignArgs: (subject: string): TappedConsignArgs => ({
    contextModule: ContextModule.sellFooter,
    contextScreenOwnerType: OwnerType.sell,
    subject,
  }),
}
