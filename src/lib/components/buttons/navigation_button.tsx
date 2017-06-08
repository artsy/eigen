import * as React from "react"
import { Image, Text, TouchableWithoutFeedback, View } from "react-native"

import SwitchBoard from "../../native_modules/switch_board"
import Separator from "../separator"

interface Props extends React.Props<NavigationButton> {
  href: string
  title: string
  style?: any
}

export default class NavigationButton extends React.Component<Props, any> {
  render() {
    return (
      <View style={[{ marginBottom: 20, marginLeft: 20, marginRight: 20 }, this.props.style]}>
        <TouchableWithoutFeedback onPress={this.openLink.bind(this)}>
          <View style={{}}>
            <Separator style={{ marginRight: 0, marginLeft: 0 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Avant Garde Gothic ITCW01Dm", marginTop: 14, marginBottom: 14 }}>
                {this.props.title.toUpperCase()}
              </Text>
              <Image style={{ alignSelf: "center" }} source={require("../../../../images/horizontal_chevron.png")} />
            </View>
            <Separator style={{ marginRight: 0, marginLeft: 0 }} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  openLink() {
    SwitchBoard.presentNavigationViewController(this, this.props.href)
  }
}
