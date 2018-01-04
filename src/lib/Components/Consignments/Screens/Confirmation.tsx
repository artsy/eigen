import React from "react"
import { Image, NavigatorIOS, Route, View, ViewProperties } from "react-native"

import { Schema, screenTrack } from "lib/utils/track"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import ConsignmentBG from "../Components/ConsignmentBG"
import { BorderedBlackButton, Button } from "../Components/FormElements"
import { LargeHeadline } from "../Typography/index"
import Welcome from "./Welcome"

// import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Spinner = styled(Image)`
  margin-bottom: 20;
`

const Subtitle = styled(LargeHeadline)`
  font-size: 20;
`

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Confirmation extends React.Component<Props, null> {
  exitModal = () => SwitchBoard.dismissModalViewController(this)
  restart = () => this.props.navigator.push({ component: Welcome })

  progressContent = () => (
    <View>
      <Spinner source={require("../../../../../images/whitespinner.png")} />
      <LargeHeadline>Submitting your work</LargeHeadline>
    </View>
  )
  successContent = () => (
    <View>
      <LargeHeadline>Succesfully submitted</LargeHeadline>
      <Subtitle>You will receive a confirmation email shortly.</Subtitle>
      <Button text="DONE" onPress={this.exitModal} />
    </View>
  )
  failedContent = () => (
    <View>
      <LargeHeadline>Submission failed</LargeHeadline>
      <Subtitle>Please try again.</Subtitle>
      <BorderedBlackButton text="TRY AGAIN" onPress={this.restart} />
      <Button text="QUIT" onPress={this.exitModal} />
    </View>
  )

  render() {
    return (
      <ConsignmentBG>
        <Container>{this.failedContent()}</Container>
      </ConsignmentBG>
    )
  }
}
