import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { Theme } from "@artsy/palette"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import { ArtworkForm } from "../../ArtworkForm"

export class NewArtworkForm extends React.Component {
  render() {
    const closeForm = () => {
      SwitchBoard.dismissModalViewController(this)
    }

    const initialRoute = {
      component: ArtworkForm,
      passProps: { closeForm },
      title: "Add a work",
    }

    return (
      <Theme>
        <NavigatorIOS initialRoute={initialRoute} style={{ flex: 1 }} />
      </Theme>
    )
  }
}
