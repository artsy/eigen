import React from "react"
import { Box, Button, Sans } from "@artsy/palette"
import SwitchBoard from "../../../NativeModules/SwitchBoard"

interface NewSubmissionFormProps {
  artworkID?: string
}

export class NewSubmissionForm extends React.Component<NewSubmissionFormProps> {
  render() {
    const { artworkID } = this.props

    const handleClosePress = () => {
      SwitchBoard.dismissModalViewController(this)
    }

    let headline: string

    if (artworkID) {
      headline = `New Submission for Artwork ${artworkID}`
    } else {
      headline = "New Consignment Submission"
    }

    return (
      <Box p="2">
        <Sans size="10">{headline}</Sans>
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
