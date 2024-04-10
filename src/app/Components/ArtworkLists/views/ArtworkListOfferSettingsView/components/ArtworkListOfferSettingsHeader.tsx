import { Box, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"

export const ArtworkListOfferSettingsHeader = () => {
  const handleLearnMoreTap = () => {
    navigate("https://support.artsy.net/s/article/Offers-on-saved-works")
  }

  return (
    <Box mx={2} mb={2}>
      <Text variant="sm-display">Offer Settings</Text>

      <Spacer y={2} />

      <Text variant="xs">
        Shared lists are eligible to receive offers from galleries. Switching sharing off will make
        them visible only to you, and you won't receive offers.{" "}
        <LinkText onPress={handleLearnMoreTap} variant="xs">
          Learn more
        </LinkText>
      </Text>
    </Box>
  )
}
