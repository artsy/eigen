import { Button, Sans, Theme } from "palette"
import React from "react"
import { BackHandler, NativeEventSubscription, View } from "react-native"
import { blockRegex } from "simple-markdown"

import { Icon20 } from "../Components/Icon"
import { Flex } from "../Elements/Flex"

import { Markdown } from "../../Markdown"
import { Title } from "../Components/Title"

import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "app/navigation/navigate"
import { defaultRules } from "app/utils/renderMarkdown"
import { Schema, screenTrack } from "app/utils/track"

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
  RegistrationStatusComplete: require("../../../../../images/circle-check-green.webp"),
  RegistrationStatusPending: require("../../../../../images/circle-exclamation.webp"),
  RegistrationStatusNetworkError: require("../../../../../images/circle-x-red.webp"),
  RegistrationStatusError: require("../../../../../images/circle-x-red.webp"),
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
  description:
    "Please contact [support@artsy.net](mailto:support@artsy.net)\n" + "with any questions.",
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
  backButtonListener?: NativeEventSubscription = undefined

  componentDidMount = () => {
    this.backButtonListener = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton
    )
  }

  componentWillUnmount = () => {
    this.backButtonListener?.remove()
  }

  handleBackButton = () => {
    if (
      this.props.status === RegistrationStatus.RegistrationStatusComplete ||
      this.props.status === RegistrationStatus.RegistrationStatusPending
    ) {
      dismissModal()
      return true
    } else {
      return false
    }
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
      <View style={{ flex: 1 }}>
        <Theme>
          <FancyModalHeader useXButton onLeftButtonPress={dismissModal} />
        </Theme>
        <View style={{ padding: 20 }}>
          <Flex alignItems="center">
            {status !== RegistrationStatus.RegistrationStatusPending && (
              <Icon20 source={Icons[status]} />
            )}
            <Title mt={2} mb={4}>
              {title}
            </Title>
            <Markdown rules={markdownRules} mb={5}>
              {msg}
            </Markdown>
          </Flex>
          <Button variant="outline" onPress={dismissModal} block width={100}>
            {status === RegistrationStatus.RegistrationStatusPending
              ? "View works in this sale"
              : "Continue"}
          </Button>
        </View>
      </View>
    )
  }
}
