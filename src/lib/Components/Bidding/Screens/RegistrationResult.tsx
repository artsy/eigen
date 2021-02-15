import { Button, Sans } from "palette"
import React from "react"
import { View } from "react-native"
import { blockRegex } from "simple-markdown"

import { Icon20 } from "../Components/Icon"
import { Flex } from "../Elements/Flex"

import { Markdown } from "../../Markdown"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { Title } from "../Components/Title"

import { dismissModal } from "lib/navigation/navigate"
import { defaultRules } from "lib/utils/renderMarkdown"
import { Schema, screenTrack } from "lib/utils/track"

interface RegistrationResultProps {
  status: RegistrationStatus
  needsIdentityVerification?: boolean
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
  RegistrationStatusNetworkError: require("../../../../../images/circle-x-red.png"),
  RegistrationStatusError: require("../../../../../images/circle-x-red.png"),
}

const registrationCompleteMessage = {
  title: "Registration complete",
  description: "Thank you for registering. You’re now eligible to bid on works in this sale.",
}

const registrationPendingMessage = {
  title: "Registration pending",
  description:
    "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email [specialist@artsy.net](mailto:support@artsy.net) with any questions.\n" +
    "\n" +
    "In the meantime, you can still view works and watch lots you’re interested in.",
}

const registrationPendingDueToUnverifiedStatusMessage = {
  title: "Registration pending",
  description:
    "This auction requires Artsy to verify your identity before bidding.\n" +
    "\n" +
    "For details about identity verification, please see the [FAQ](/identity-verification-faq) or contact [verification@artsy.net](mailto:verification@artsy.net).\n" +
    "\n" +
    "A link to complete identity verification has been sent to your email.",
}

const registrationErrorMessage = {
  title: "An error occurred",
  description: "Please contact [support@artsy.net](mailto:support@artsy.net)\n" + "with any questions.",
}

const registrationNetworkErrorMessage = {
  title: "An error occurred",
  description: "Please\ncheck your internet connection\nand try again.",
}

const markdownRules = defaultRules({
  modal: true,
  ruleOverrides: {
    paragraph: {
      match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => {
        return (
          <Sans size="4" key={state.key} textAlign="center">
            {output(node.content, state)}
          </Sans>
        )
      },
    },
  },
})

const resultEnumToPageName = (result: RegistrationStatus) => {
  let pageName: Schema.PageNames
  switch (result) {
    case RegistrationStatus.RegistrationStatusComplete:
      pageName = Schema.PageNames.BidFlowRegistrationResultConfirmed
      break
    case RegistrationStatus.RegistrationStatusPending:
      pageName = Schema.PageNames.BidFlowRegistrationResultPending
      break
    default:
      pageName = Schema.PageNames.BidFlowRegistrationResultError
  }
  return pageName
}

@screenTrack(
  (props: RegistrationResultProps) =>
    ({
      context_screen: resultEnumToPageName(props.status),
      context_screen_owner_type: null,
    } as any) /* STRICTNESS_MIGRATION */
)
export class RegistrationResult extends React.Component<RegistrationResultProps> {
  exitBidFlow = () => {
    dismissModal()
  }

  render() {
    const { status, needsIdentityVerification } = this.props
    let title: string
    let msg: string

    switch (status) {
      case RegistrationStatus.RegistrationStatusComplete:
        title = registrationCompleteMessage.title
        msg = registrationCompleteMessage.description
        break
      case RegistrationStatus.RegistrationStatusPending:
        if (needsIdentityVerification) {
          title = registrationPendingDueToUnverifiedStatusMessage.title
          msg = registrationPendingDueToUnverifiedStatusMessage.description
        } else {
          title = registrationPendingMessage.title
          msg = registrationPendingMessage.description
        }
        break
      case RegistrationStatus.RegistrationStatusNetworkError:
        title = registrationNetworkErrorMessage.title
        msg = registrationNetworkErrorMessage.description
        break
      default:
        title = registrationErrorMessage.title
        msg = registrationErrorMessage.description
        break
    }

    return (
      <BiddingThemeProvider>
        <Container mt="6">
          <View>
            <Flex alignItems="center">
              {status !== RegistrationStatus.RegistrationStatusPending && <Icon20 source={Icons[status]} />}
              <Title mt="2" mb="4">
                {title}
              </Title>
              <Markdown rules={markdownRules} mb="5">
                {msg}
              </Markdown>
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
