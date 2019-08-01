import React from "react"
import { View } from "react-native"

import { Icon20 } from "../Components/Icon"
import { Flex } from "../Elements/Flex"

import { Markdown } from "../../Markdown"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { Title } from "../Components/Title"

import { Button } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack } from "../../../utils/track"

interface RegistrationResultProps {
  status: RegistrationStatus
}

export enum RegistrationStatus {
  RegistrationStatusComplete = "RegistrationStatusComplete",
  RegistrationStatusPending = "RegistrationStatusPending",
  RegistrationStatusError = "RegistrationStatusError",
  RegistrationStatusNetworkError = "RegistrationStatusNetworkError",
}

const Icons = {
  RegistrationStatusComplete: require("../../../../../images/circle-check-green.png"),
  RegistrationStatusPending: require("../../../../../images/circle-exclamation.png"),
  RegistrationStatusError: require("../../../../../images/circle-x-red.png"),
}

const registrationCompleteMessage = {
  title: "Registration complete",
  description: "Thank you for registering. You’re now eligible\n" + "to bid on works in this sale.",
}

const registrationPendingMessage = {
  title: "Registration pending",
  description:
    "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email specialist@artsy.net with any questions.\n" +
    "\n" +
    "In the meantime, you can still view works and watch lots you’re interested in.\n",
}

const registrationErrorMessage = {
  title: "An error occured",
  description: "Please contact [support@artsy.net](mailto:support@artsy.net)\n" + "with any questions.",
}

const registrationNetworkErrorMessage = {
  title: "An error occurred",
  description: "Please\ncheck your internet connection\nand try again.",
}

const resultEnumToPageName = (result: RegistrationStatus) => {
  let pageName: Schema.PageNames
  switch (result) {
    case RegistrationStatus.RegistrationStatusComplete:
      pageName = Schema.PageNames.BidFlowRegistrationResultConfirmed
      break
    case RegistrationStatus.RegistrationStatusPending:
      pageName = Schema.PageNames.BidFlowRegistrationResultPending
    default:
      pageName = Schema.PageNames.BidFlowRegistrationResultError
  }
  return pageName
}

@screenTrack((props: RegistrationResultProps) => ({
  context_screen: resultEnumToPageName(props.status),
  context_screen_owner_type: null,
}))
export class RegistrationResult extends React.Component<RegistrationResultProps, null> {
  exitBidFlow = async () => {
    await SwitchBoard.dismissModalViewController(this)
  }

  render() {
    const status = this.props.status
    let title: string
    let msg: string

    switch (status) {
      case RegistrationStatus.RegistrationStatusComplete:
        title = registrationCompleteMessage.title
        msg = registrationCompleteMessage.description
        break
      case RegistrationStatus.RegistrationStatusPending:
        title = registrationPendingMessage.title
        msg = registrationPendingMessage.description
        break
      case RegistrationStatus.RegistrationStatusNetworkError:
        title = registrationNetworkErrorMessage.title
        msg = registrationNetworkErrorMessage.description
      default:
        title = registrationErrorMessage.title
        msg = registrationErrorMessage.description
        break
    }

    return (
      <BiddingThemeProvider>
        <Container mt={6}>
          <View>
            <Flex alignItems="center">
              {status !== RegistrationStatus.RegistrationStatusPending && <Icon20 source={Icons[status]} />}
              <Title mt={2} mb={4}>
                {title}
              </Title>
              <Markdown mb={5}>{msg}</Markdown>
            </Flex>
          </View>
          <Button variant="secondaryOutline" onPress={this.exitBidFlow} block width={100}>
            {status === RegistrationStatus.RegistrationStatusPending ? "View works in this sale" : "Continue"}
          </Button>
        </Container>
      </BiddingThemeProvider>
    )
  }
}
