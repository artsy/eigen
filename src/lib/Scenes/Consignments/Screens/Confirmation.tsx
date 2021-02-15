import Spinner from "lib/Components/Spinner"
import { dismissModal, navigate } from "lib/navigation/navigate"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { Schema, screenTrack } from "lib/utils/track"
import { Box, Button, color, Flex, Sans, Spacer } from "palette"
import React from "react"
import { View, ViewProperties } from "react-native"
import styled from "styled-components/native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  /** Used for testing, it's expected to be undefined in prod */
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const success = this.props.submissionRequestValidationCheck()
    if (success === undefined) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    } else {
      const submissionState = success ? SubmissionTypes.SuccessfulSubmission : SubmissionTypes.FailedSubmission
      this.setState({ submissionState })
    }
  }

  exitModal = () => dismissModal()
  exitModalAndGoHome = () => {
    dismissModal()
    navigate("/")
  }
  restart = () => this.props.navigator.popToTop()

  progressContent = () => (
    <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )

  successContent = () => (
    <View>
      <Box px="2">
        <Sans size="6" style={{ textAlign: "center" }}>
          Thank you for submitting your consignment
        </Sans>
        <Spacer mb="3" />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          Our team of specialists are reviewing your work. You'll receive an email update once the status of your
          submission changes.
        </Sans>
        <Spacer mb="3" />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          If your work is accepted, Artsy will gather competitive offers and guide you through the selling process.
        </Sans>
        <Spacer mb="3" />
        <Flex alignItems="stretch" flexDirection="column" width="100%">
          <Button block width={100} onPress={this.exitModal}>
            Done
          </Button>
          <Spacer mb="2" />
          <Button block width={100} onPress={this.exitModalAndGoHome} variant="secondaryOutline">
            Browse new works for sale
          </Button>
        </Flex>
      </Box>
    </View>
  )
  failedContent = () => (
    <View>
      <Box px="2">
        <Sans size="6" style={{ textAlign: "center" }}>
          Submission failed
        </Sans>
        <Spacer mb="2" />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          We’re sorry, something went wrong. Please try submitting your consignment again.
        </Sans>
        <Spacer mb="3" />
        <Flex flexDirection="row" justifyContent="center">
          <Button block width={100} onPress={this.restart}>
            Try again
          </Button>
        </Flex>
        <Spacer mb="2" />
        <Flex flexDirection="row" justifyContent="center">
          <Button variant="secondaryOutline" block width={100} onPress={this.exitModal}>
            Quit
          </Button>
        </Flex>
      </Box>
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
