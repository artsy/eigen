import * as React from "react"

import Button from "../../Buttons/FlatWhite"
import Circle from "../Components/CircleImage"
import { BodyText as P, LargeHeadline } from "../Typography"
import Overview from "./Overview"

import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

export default class Welcome extends React.Component<Props, null> {
  goTapped = () => {
    this.props.navigator.push({
      component: Overview,
    })
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: "black" }}>
        <View style={{ flex: 1, paddingTop: 40, alignItems: "center" }}>
          <LargeHeadline>Sell works from your collection through our partner network</LargeHeadline>

          <View style={{ width: 300, alignItems: "center", marginTop: 20 }}>
            <Circle source={require("../images/email.png")} />
            <P>Sell work from your collection through our partner network.</P>
            <Circle source={require("../images/hammer.png")} />
            <P>Get your work placed in an upcoming sale.</P>
          </View>

          <View style={{ height: 43, width: 320, marginTop: 20 }}>
            <Button text="GET STARTED" onPress={this.goTapped} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}
