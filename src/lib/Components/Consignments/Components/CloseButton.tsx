import React from "react"
import { ViewProperties } from "react-native"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import { BlackButton } from "../Components/FormElements"

export default class CloseButton extends React.Component<ViewProperties> {
  exitModal = () => SwitchBoard.dismissModalViewController(this)

  render() {
    return (
      <BlackButton text="CLOSE" onPress={this.exitModal} style={Object.assign({ marginTop: 4 }, this.props.style)} />
    )
  }
}
