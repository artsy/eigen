import React from "react"
import { Box, Button, Sans } from "@artsy/palette"
import NavigatorIOS from "react-native-navigator-ios"
import { Summary } from "./Summary"

interface ArtworkFormProps {
  closeForm: () => void
  navigator: NavigatorIOS
}

export const ArtworkForm: React.FC<ArtworkFormProps> = props => {
  const handleClosePress = () => {
    props.closeForm()
  }

  const pushRoute = (route: any): void => {
    props.navigator.push(route)
  }

  return (
    <Box p="2" pt="50">
      <Sans size="5">Add an artwork to your collection</Sans>
      <Sans size="3">Add works to evaluate, when you're ready, consign.</Sans>
      <Summary pushRoute={pushRoute} />
      <Button block onPress={handleClosePress}>
        Add
      </Button>
    </Box>
  )
}
