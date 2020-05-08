import React from "react"
import { Box, Button, Sans } from "@artsy/palette"
import SwitchBoard from "../../../NativeModules/SwitchBoard"

interface EditArtworkFormProps {
  artworkID: string
}

export class EditArtworkForm extends React.Component<EditArtworkFormProps> {
  render() {
    const { artworkID } = this.props

    const handleClosePress = () => {
      SwitchBoard.dismissModalViewController(this)
    }

    return (
      <Box p="2">
        <Sans size="10">Edit Artwork</Sans>
        <Sans size="10">{artworkID}</Sans>
        <Sans size="2">blah</Sans>
        <Sans size="2">blah</Sans>
        <Sans size="2">blah</Sans>
        <Sans size="2">blah</Sans>
        <Button block onPress={handleClosePress}>
          Close
        </Button>
      </Box>
    )
  }
}
