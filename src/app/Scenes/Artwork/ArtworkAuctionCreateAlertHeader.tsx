import { BellIcon, Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { FC } from "react"

export const ArtworkAuctionCreateAlertHeader: FC = () => {
  return (
    <Flex flexDirection="column">
      <Text variant="lg">Bidding for 'Refugees', Josef Herman has closed.</Text>

      <Spacer y={1} />

      <Text variant="sm" color="black60">
        Get notified when similar works become abailable, or browse hand picked artworks that match
        this lot.
      </Text>

      <Spacer y={2} />

      <Button
        size="large"
        variant="fillDark"
        haptic
        onPress={() => {}}
        icon={<BellIcon fill="white100" />}
        flex={1}
      >
        Create Alert
      </Button>

      <Spacer y={1} />

      <Button size="large" variant="outline" haptic onPress={() => {}} flex={1}>
        Browse Similar Artworks
      </Button>
    </Flex>
  )
}
