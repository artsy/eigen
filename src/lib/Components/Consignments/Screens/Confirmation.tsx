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

interface State {
  submissionState: SubmissionTypes
}

// Can be exported if we want it to work with the network calls in Overview
// Would need to be a prop then
// Not sure how it works when pushing a new nav cont though, seeing as it wouldn't be a child view / comp
enum SubmissionTypes {
  Submitting = "Submitting",
  SuccessfulSubmission = "SuccessfulSubmission",
  FailedSubmission = "FailedSubmission",
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const CenterImage = styled(Image)`
  margin-bottom: 20;
  resize-mode: contain;
`
const ImageContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`
const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const ButtonView = styled.View`
  margin-bottom: 60px;
`
const Subtitle = styled(LargeHeadline)`
  font-size: 20;
`

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Confirmation extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { submissionState: SubmissionTypes.Submitting }
  }

  exitModal = () => SwitchBoard.dismissModalViewController(this)
  restart = () => this.props.navigator.push({ component: Welcome })

  progressContent = () => (
    <View>
      <ImageContainer>
        <CenterImage source={require("../../../../../images/whitespinner.png")} />
      </ImageContainer>
      <TextContainer>
        <View>
          <LargeHeadline>Submitting your work</LargeHeadline>
        </View>
      </TextContainer>
    </View>
  )
  successContent = () => (
    <View>
      <ImageContainer>
        <CenterImage source={require("../../../../../images/consignments/success.png")} />
      </ImageContainer>
      <TextContainer>
        <View>
          <LargeHeadline>Succesfully submitted</LargeHeadline>
          <Subtitle>You will receive a confirmation email shortly.</Subtitle>
        </View>
        <ButtonView>
          <Button text="DONE" onPress={this.exitModal} />
        </ButtonView>
      </TextContainer>
    </View>
  )
  failedContent = () => (
    <View>
      <ImageContainer>
        <CenterImage source={require("../../../../../images/consignments/failure.png")} />
      </ImageContainer>
      <TextContainer>
        <View>
          <LargeHeadline>Submission failed</LargeHeadline>
          <Subtitle>Please try again.</Subtitle>
        </View>
        <ButtonView>
          <BorderedBlackButton text="TRY AGAIN" onPress={this.restart} />
          <Button text="QUIT" onPress={this.exitModal} />
        </ButtonView>
      </TextContainer>
    </View>
  )

  confirmationContent() {
    if (this.state.submissionState === SubmissionTypes.Submitting) {
      return this.progressContent()
    } else if (this.state.submissionState === SubmissionTypes.SuccessfulSubmission) {
      return this.successContent()
    } else if (this.state.submissionState === SubmissionTypes.FailedSubmission) {
      return this.failedContent()
    }
  }

  render() {
    return (
      <ConsignmentBG>
        <Container>{this.confirmationContent()}</Container>
      </ConsignmentBG>
    )
  }
}
