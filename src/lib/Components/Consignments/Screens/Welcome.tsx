import React from "react"
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

import { Router } from "lib/utils/router"
import SwitchBoard from "../../../NativeModules/SwitchBoard"

import { pageViewTrack, Schema, Track } from "lib/utils/track"
import Circle from "../Components/CircleImage"
import ConsignmentBG from "../Components/ConsignmentBG"
import { Button } from "../Components/FormElements"
import { BodyText as P, LargeHeadline, SmallPrint } from "../Typography"
import Overview from "./Overview"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

@pageViewTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_slug: null,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Welcome extends React.Component<Props, null> {
  goTapped = () => this.props.navigator.push({ component: Overview })

  // It's not optimal to dismiss the modal, but otherwise we get into all sorts of tricky states
  privacyPolicyTapped = () =>
    SwitchBoard.dismissModalViewController(this) &&
    SwitchBoard.presentNavigationViewController(this, Router.PrivacyPage)

  TOSTapped = () =>
    SwitchBoard.dismissModalViewController(this) &&
    SwitchBoard.presentNavigationViewController(this, Router.TermsOfService)

  render() {
    const isPad = Dimensions.get("window").width > 700
    const isPadHorizontal = Dimensions.get("window").height > 700

    const TOS = () =>
      <Text style={{ textDecorationStyle: "solid", textDecorationLine: "underline" }} onPress={this.TOSTapped}>
        Terms of Sevice
      </Text>

    const Privacy = () =>
      <Text
        style={{ textDecorationStyle: "solid", textDecorationLine: "underline" }}
        onPress={this.privacyPolicyTapped}
      >
        Privacy Policy
      </Text>

    return (
      <ConsignmentBG showCloseButton>
        <ScrollView style={{ flex: 1 }} centerContent>
          <View
            style={{
              marginTop: 40,
              alignItems: "center",
              alignSelf: "center",
              width: "100%",
              maxWidth: 540,
            }}
          >
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

            <SmallPrint style={{ width: 360, marginTop: 20 }}>
              By submitting works to Artsy’s consignment program you agree to our {TOS()} and {Privacy()}
            </SmallPrint>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
