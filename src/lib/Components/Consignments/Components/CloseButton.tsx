import { Box, Button } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"

import SwitchBoard from "../../../NativeModules/SwitchBoard"

export default class CloseButton extends React.Component<ViewProperties> {
  exitModal = () => SwitchBoard.dismissModalViewController(this)

  render() {
    return (
      <Box style={Object.assign({ marginTop: 4, width: 174 }, this.props.style)}>
        <Button block width="100%" onPress={this.exitModal}>
          CLOSE
        </Button>
      </Box>
    )
  }
}
