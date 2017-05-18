import * as React from "react"
import * as Relay from "react-relay"

import Button from "../../buttons/flat_white"
import Circle from "../components/circle_image"
import {
  BodyText as P,
  LargeHeadline,
} from "../typography"
import Info from "./info"

import {
  LayoutChangeEvent,
  NavigatorIOS,
  Route,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
  ViewProperties,
} from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS,
  route: Route
}

export default class Welcome extends React.Component<Props, any> {
  goTapped = () => {
    this.props.navigator.push({
      component: Info,
    })
  }

  render() {
    return  (
      <ScrollView style={{backgroundColor: "black"}}>
        <View style={{flex: 1, paddingTop: 40, alignItems: "center"}}>
          <LargeHeadline>Sell works from your collection through our partner network</LargeHeadline>

          <View style={{width: 300, alignItems: "center", marginTop: 20}}>
            <Circle source={require("../images/email.png")} />
            <P>Sell work from your collection through our partner network.</P>
            <Circle source={require("../images/hammer.png")} />
            <P>Get your work placed in an upcoming sale.</P>
          </View>

          <View style={{height: 43, width: 320, marginTop: 20}}>
            <Button text="GET STARTED" onPress={this.goTapped}/>
          </View>
        </View>
      </ScrollView>
    )
  }
}
