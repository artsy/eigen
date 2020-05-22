import { Box, Button, Sans, Spacer } from "@artsy/palette"
import React from "react"
import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellHeader,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Start selling",
}

interface HeaderProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress }) => {
  const handlePress = () => {
    onConsignPress(consignArgs)
  }

  return (
    <Box px={2} mt={3}>
      <Box>
        <Sans size="8" textAlign="center" px={2}>
          Sell Art From Your Collection
        </Sans>

        <Spacer my={0.5} />

        <Sans size="4" textAlign="center">
          Reach art buyers all over the world.
        </Sans>
      </Box>

      <Spacer mb={2} />

      <Button variant="primaryBlack" block onPress={handlePress}>
        <Sans size="3" weight="medium">
          Start selling
        </Sans>
      </Button>
    </Box>
  )
}
