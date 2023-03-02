import { TappedConsignArgs } from "@artsy/cohesion"
import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { Separator } from "palette"
import React from "react"

export const Footer: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const enableNewSwaLandingPage = useFeatureFlag("AREnableNewSWALandingPage")
  if (enableNewSwaLandingPage) {
    return <NewFooter onConsignPress={onConsignPress} />
  }
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
    <Flex mx={2} mb={4}>
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

const NewFooter: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const isTablet = isPad()
  return (
    <Flex mx={2} alignItems={isTablet ? "center" : undefined}>
      <Text variant="lg-display">
        Sell with Artsy is the simple, contemporary way to sell art from your collection.
      </Text>
      <Spacer y={2} />
      {/**TODO: Implement tracking. Add sellHowItWorks to ContextModule */}
      <Button
        block={!isTablet}
        minWidth={isTablet ? "50%" : undefined}
        onPress={() => onConsignPress({} as TappedConsignArgs)}
      >
        Start Selling
      </Button>
    </Flex>
  )
}
