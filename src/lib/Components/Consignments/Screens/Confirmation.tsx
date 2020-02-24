import { Button, color, Flex, Serif, Spacer } from "@artsy/palette"
import Spinner from "lib/Components/Spinner"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { NavigatorIOS, Route, View, ViewProperties } from "react-native"
import styled from "styled-components/native"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
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
    <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )

  successContent = () => (
    <View>
      <Serif size="5" style={{ textAlign: "center" }}>
        Succesfully submitted
      </Serif>
      <Serif size="4" color={color("black60")} style={{ textAlign: "center" }}>
        You will receive a confirmation email shortly.
      </Serif>
      <Spacer mb={3} />
      <Flex flexDirection="row" justifyContent="center">
        <Button onPress={this.exitModal}>Done</Button>
      </Flex>
    </View>
  )
  failedContent = () => (
    <View>
      <Serif size="5" style={{ textAlign: "center" }}>
        Submission failed
      </Serif>
      <Serif size="4" color={color("black60")} style={{ textAlign: "center" }}>
        Please try again.
      </Serif>
      <Spacer mb={3} />
      <Flex flexDirection="row" justifyContent="center">
        <Button onPress={this.restart}>Try again</Button>
      </Flex>
      <Spacer mb={1} />
      <Flex flexDirection="row" justifyContent="center">
        <Button variant="noOutline" onPress={this.exitModal}>
          Quit
        </Button>
      </Flex>
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
