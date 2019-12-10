import { Button, Flex } from "@artsy/palette"
import { RotatingView } from "lib/Components/UtilityViews/RotatingView"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { Image, NavigatorIOS, Route, View, ViewProperties } from "react-native"
import styled from "styled-components/native"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import { FormButton } from "../Components/FormElements"
import { LargeHeadline } from "../Typography/index"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  /** Used for testing and storybooks, it's expected to be undefined in prod */
  initialState?: SubmissionTypes

  /** Callback for when the spinner has been showing for after 1 second */
  submissionRequestValidationCheck?: () => boolean
}

interface State {
  submissionState: SubmissionTypes
}

export enum SubmissionTypes {
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
  margin-top: 20;
`
const ButtonView = styled.View`
  margin-bottom: 60px;
`
const Subtitle = styled(LargeHeadline)`
  font-size: 20;
`

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsSubmission,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Confirmation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      submissionState: props.initialState || SubmissionTypes.Submitting,
    }

    if (this.state.submissionState === SubmissionTypes.Submitting && props.submissionRequestValidationCheck) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    }
  }

  checkForSubmissionStatus = () => {
    const success = this.props.submissionRequestValidationCheck()
    if (success === undefined) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    } else {
      const submissionState = success ? SubmissionTypes.SuccessfulSubmission : SubmissionTypes.FailedSubmission
      this.setState({ submissionState })
    }
  }

  exitModal = () => SwitchBoard.dismissModalViewController(this)
  restart = () => this.props.navigator.push({ component: Welcome })

  progressContent = () => (
    <View>
      <ImageContainer>
        <RotatingView loop={true}>
          <CenterImage source={require("../../../../../images/whitespinner.png")} />
        </RotatingView>
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
          <FormButton text="Done" onPress={this.exitModal} />
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
          <Flex flexDirection="row" justifyContent="center">
            <FormButton text="Try again" onPress={this.restart} />
          </Flex>
          <Button block width={100} onPress={this.exitModal}>
            Quit
          </Button>
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
    return <Container>{this.confirmationContent()}</Container>
  }
}
