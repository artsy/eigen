import { navigate } from "lib/navigation/navigate"
import { Box, Button, Sans, Spacer } from "palette"
import React from "react"

export const Header: React.FC = () => {
  const handlePress = () => {
    navigate("/submit-artwork")
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
      <Button testID="header-cta" variant="fillDark" block onPress={handlePress} haptic>
        <Sans size="3" weight="medium">
          Submit a work
        </Sans>
      </Button>
    </Box>
  )
}
