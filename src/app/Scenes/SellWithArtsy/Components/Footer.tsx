import { navigate } from "app/navigation/navigate"
import { Flex, Separator, Text } from "palette"
import React from "react"

export const Footer: React.FC = () => {
  const handleBecomeAPartnerPress = () => {
    navigate("https://partners.artsy.net")
  }

  const handleHelpCenterPress = () => {
    navigate("https://support.artsy.net/hc/en-us/categories/360003689533-Sell")
  }

  const handleFAQPress = () => {
    navigate("https://artsy.net/sell/faq")
  }

  return (
    <Flex mx={2}>
      <Separator />
      <Text variant="sm" mb={1} mt={2}>
        Gallerist or Art Dealer?
      </Text>
      <Text variant="xs" color="black60" mb={2}>
        <Text
          variant="xs"
          onPress={handleBecomeAPartnerPress}
          style={{ textDecorationLine: "underline" }}
        >
          Become a partner
        </Text>{" "}
        to access the world’s largest online art marketplace.
      </Text>
      <Separator />
      <Text variant="sm" mb={1} mt={1} pt={0.5}>
        Have a Question?
      </Text>
      <Text variant="xs" color="black60" mb={2}>
        Visit our{" "}
        <Text
          variant="xs"
          onPress={handleHelpCenterPress}
          style={{ textDecorationLine: "underline" }}
        >
          Help Center
        </Text>{" "}
        or{" "}
        <Text variant="xs" onPress={handleFAQPress} style={{ textDecorationLine: "underline" }}>
          read our FAQs
        </Text>
        .
      </Text>
    </Flex>
  )
}
