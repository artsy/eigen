import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import Spinner from "app/Components/Spinner"
import { navigate, popToRoot } from "app/navigation/navigate"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Schema, screenTrack } from "app/utils/track"
import { Box, Button, ClassTheme, Flex, Sans, Spacer } from "palette"
import React from "react"
import { Alert, BackHandler, NativeEventSubscription, View, ViewProps } from "react-native"
import styled from "styled-components/native"

interface Props extends ViewProps {
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
  backButtonListener?: NativeEventSubscription = undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      submissionState: props.initialState || SubmissionTypes.Submitting,
    }

    if (
      this.state.submissionState === SubmissionTypes.Submitting &&
      props.submissionRequestValidationCheck
    ) {
      setTimeout(this.checkForSubmissionStatus.bind(this), 1000)
    }
  }

  componentDidMount = () => {
    this.backButtonListener = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleDismiss.bind(this)
    )
  }

  componentWillUnmount = () => {
    if (this.backButtonListener) {
      this.backButtonListener.remove()
    }
  }

  handleDismiss = () => {
    if (this.state.submissionState === SubmissionTypes.Submitting) {
      Alert.alert("Leave this screen?", "Your consignment submission is still in progress", [
        { text: "Leave Now", onPress: () => popToRoot() },
        { text: "Wait", style: "default" },
      ])
    } else {
      popToRoot()
    }
    return true
  }

  checkForSubmissionStatus = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const success = this.props.submissionRequestValidationCheck()
    if (success === undefined) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    } else {
      const submissionState = success
        ? SubmissionTypes.SuccessfulSubmission
        : SubmissionTypes.FailedSubmission
      this.setState({ submissionState })
    }
  }
  exit = () => popToRoot()
  exitAndGoHome = () => {
    popToRoot()
    navigate("/")
  }

  restart = () => this.props.navigator.popToTop()

  progressContent = () => (
    <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )

  successContent = () => (
    <ClassTheme>
      {({ color }) => (
        <View>
          <Box px={2}>
            <Sans size="6" style={{ textAlign: "center" }}>
              Thank you for submitting your consignment
            </Sans>
            <Spacer mb={3} />
            <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
              Our team of specialists are reviewing your work. You'll receive an email update once
              the status of your submission changes.
            </Sans>
            <Spacer mb={3} />
            <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
              If your work is accepted, Artsy will gather competitive offers and guide you through
              the selling process.
            </Sans>
            <Spacer mb={3} />
            <Flex alignItems="stretch" flexDirection="column" width="100%">
              <Button block width={100} onPress={this.exit}>
                Done
              </Button>
              <Spacer mb={2} />
              <Button block width={100} onPress={this.exitAndGoHome} variant="outline">
                Browse new works for sale
              </Button>
            </Flex>
          </Box>
        </View>
      )}
    </ClassTheme>
  )

  failedContent = () => (
    <ClassTheme>
      {({ color }) => (
        <View>
          <Box px={2}>
            <Sans size="6" style={{ textAlign: "center" }}>
              Submission failed
            </Sans>
            <Spacer mb={2} />
            <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
              We’re sorry, something went wrong. Please try submitting your consignment again.
            </Sans>
            <Spacer mb={3} />
            <Flex flexDirection="row" justifyContent="center">
              <Button block width={100} onPress={this.restart}>
                Try again
              </Button>
            </Flex>
            <Spacer mb={2} />
            <Flex flexDirection="row" justifyContent="center">
              <Button variant="outline" block width={100} onPress={this.exit}>
                Quit
              </Button>
            </Flex>
          </Box>
        </View>
      )}
    </ClassTheme>
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
      <>
        <FancyModalHeader useXButton onLeftButtonPress={this.handleDismiss} />
        <Container>{this.confirmationContent()}</Container>
      </>
    )
  }
}
