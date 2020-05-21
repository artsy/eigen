import { Box, Button, Sans, Spacer } from "@artsy/palette"
import React from "react"
import { useCTA } from "../Utils/useCTA"

export const HeaderCTA: React.FC = () => {
  const { handleCTAPress } = useCTA()

  return (
    <Box px={2} py={6}>
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

      <Button variant="primaryBlack" block onPress={handleCTAPress}>
        <Sans size="3" weight="medium">
          Start selling
        </Sans>
      </Button>
    </Box>
  )
}
