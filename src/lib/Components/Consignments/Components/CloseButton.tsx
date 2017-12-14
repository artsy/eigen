import React from "react"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import { BlackButton } from "../Components/FormElements"

export default class CloseButton extends React.Component<{}> {
  exitModal = () => SwitchBoard.dismissModalViewController(this)

  render() {
    return <BlackButton text="CLOSE" onPress={this.exitModal} />
  }
}
