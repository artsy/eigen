import React from "react"
import { Box, Button, Sans } from "@artsy/palette"

interface BlankSlateProps {
  routeTo: (route: string) => void
}

export const BlankSlate: React.FC<BlankSlateProps> = props => {
  const route = "/consign/submission/new"
  const handleStartPress = () => {
    props.routeTo(route)
  }

  return (
    <Box p="2">
      <Sans py="5" size="10" textAlign="center">
        Sell Art From Your Collection
      </Sans>
      <Button block onPress={handleStartPress}>
        Start selling
      </Button>
    </Box>
  )
}
