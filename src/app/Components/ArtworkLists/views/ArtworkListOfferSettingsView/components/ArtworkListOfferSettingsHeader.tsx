import { Box, LinkText, Spacer, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"

export const ArtworkListOfferSettingsHeader = () => {
  return (
    <Box px={2} my={2}>
      <Text variant="lg-display">Offer Settings</Text>

      <Spacer y={2} />

      <Text variant="xs" color="mono60">
        Shared lists are eligible to receive offers from galleries. Switching sharing off will make
        them visible only to you, and you won't receive offers.{" "}
        <LinkText
          variant="xs"
          color="mono60"
          onPress={() => {
            navigate("https://support.artsy.net/s/article/Offers-on-saved-works")
          }}
        >
          Learn more
        </LinkText>
        .
      </Text>
    </Box>
  )
}
