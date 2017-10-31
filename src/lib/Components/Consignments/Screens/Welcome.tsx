import * as React from "react"
import {
  Dimensions,
  NavigatorIOS,
  Route,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  ViewProperties,
} from "react-native"

import Hyperlink from "react-native-hyperlink"

import Circle from "../Components/CircleImage"
import ConsignmentBG from "../Components/ConsignmentBG"
import { Button } from "../Components/FormElements"
import { BodyText as P, LargeHeadline, SmallPrint } from "../Typography"
import Overview from "./Overview"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

const privacyPolicyTapped = () => {
  console.log("OK")
}

const TOSTapped = () => {
  console.log("OK")
}

export default class Welcome extends React.Component<Props, null> {
  goTapped = () => this.props.navigator.push({ component: Overview })

  render() {
    const isPad = Dimensions.get("window").width > 700
    const isPadHorizontal = Dimensions.get("window").height > 700

    const TOS = () =>
      <Text style={{ textDecorationStyle: "solid", textDecorationLine: "underline" }}>Terms of Sevice</Text>

    const Privacy = () =>
      <Text style={{ textDecorationStyle: "solid", textDecorationLine: "underline" }} onPress={privacyPolicyTapped}>
        Privacy Policy
      </Text>

    return (
      <ConsignmentBG showCloseButton>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <LargeHeadline>Sell works from your collection through our partner network</LargeHeadline>

            <View style={{ width: 300, alignItems: "center", marginVertical: isPad ? 60 : 20 }}>
              <Circle source={require("../../../../../images/consignments/email.png")} />

              <P>Receive offers from partner galleries and auction houses</P>
              <Circle
                source={require("../../../../../images/consignments/hammer.png")}
                style={{ marginTop: isPad ? 30 : 0 }}
              />

              <P>Get your work placed in an upcoming sale</P>
            </View>

            <Button text="GET STARTED" onPress={this.goTapped} />

            <SmallPrint style={{ width: 360, marginTop: 20 }} onPress={() => console.log("OOK")}>
              By submitting works to Artsy’s consignment program you agree to our {TOS()} and {Privacy()}
            </SmallPrint>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
