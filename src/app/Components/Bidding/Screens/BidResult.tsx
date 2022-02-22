import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { BackHandler, NativeEventSubscription, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { dismissModal, navigate } from "app/navigation/navigate"

import { Button, Theme } from "palette"
import { Icon20 } from "../Components/Icon"
import { Flex } from "../Elements/Flex"

import { Markdown } from "../../Markdown"
import { Container } from "../Components/Containers"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { BidderPositionResult } from "../types"

import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { unsafe__getEnvironment } from "app/store/GlobalStore"

const SHOW_TIMER_STATUSES = ["WINNING", "OUTBID", "RESERVE_NOT_MET"]

interface BidResultProps {
  sale_artwork: BidResult_sale_artwork
  bidderPositionResult: BidderPositionResult
  navigator: NavigatorIOS
  refreshBidderInfo?: () => void
  refreshSaleArtwork?: () => void
}

const messageForPollingTimeout = {
  title: "Bid processing",
  description:
    "We’re receiving a high volume of traffic\n" +
    "and your bid is still processing.\n\n" +
    "If you don’t receive an update soon,\n" +
    "please contact [support@artsy.net](mailto:support@artsy.net).",
}

const Icons = {
  WINNING: require("../../../../../images/circle-check-green.webp"),
  PENDING: require("../../../../../images/circle-exclamation.webp"),
}

export class BidResult extends React.Component<BidResultProps> {
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

  onPressBidAgain = () => {
    // refetch bidder information so your registration status is up to date
    if (this.props.refreshBidderInfo) {
      this.props.refreshBidderInfo()
    }

    // fetch the latest increments for the select max bid screen
    if (this.props.refreshSaleArtwork) {
      this.props.refreshSaleArtwork()
    }

    // pushing to MaxBidScreen creates a circular relay reference but this works
    // TODO: correct the screen transition animation
    this.props.navigator.popToTop()
  }

  exitBidFlow = async () => {
    if (this.props.bidderPositionResult.status === "LIVE_BIDDING_STARTED") {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const saleSlug = this.props.sale_artwork.sale.slug
      const url = `${unsafe__getEnvironment().predictionURL}/${saleSlug}`
      navigate(url, { modal: true })
    } else {
      dismissModal()
    }
  }

  handleBackButton = () => {
    if (this.canBidAgain(this.props.bidderPositionResult.status)) {
      return false
    } else {
      dismissModal()
      return true
    }
  }

  render() {
    const { sale_artwork, bidderPositionResult } = this.props
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { liveStartAt, endAt } = sale_artwork.sale
    const { status, message_header, message_description_md } = bidderPositionResult

    return (
      <View style={{ flex: 1 }}>
        <Theme>
          <FancyModalHeader useXButton onLeftButtonPress={dismissModal} />
        </Theme>
        <Container mt={6}>
          <View>
            <Flex alignItems="center">
              <Icon20
                source={
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  Icons[status] || require("../../../../../images/circle-x-red.webp")
                }
              />
              <Title mt={2} mb={5}>
                {status === "PENDING"
                  ? messageForPollingTimeout.title
                  : message_header || "You’re the highest bidder"}
              </Title>
              {status !== "WINNING" && (
                <Markdown mb={5}>
                  {status === "PENDING"
                    ? messageForPollingTimeout.description
                    : message_description_md}
                </Markdown>
              )}
              {!!this.shouldDisplayTimer(status) && (
                <Timer liveStartsAt={liveStartAt} endsAt={endAt} />
              )}
            </Flex>
          </View>
          {this.canBidAgain(status) ? (
            <Button block width={100} onPress={() => this.onPressBidAgain()}>
              Bid again
            </Button>
          ) : (
            <Button variant="outline" block width={100} onPress={this.exitBidFlow}>
              Continue
            </Button>
          )}
        </Container>
      </View>
    )
  }

  private shouldDisplayTimer(status: string) {
    return SHOW_TIMER_STATUSES.indexOf(status) > -1
  }

  private canBidAgain(status: string) {
    return status === "OUTBID" || status === "RESERVE_NOT_MET"
  }
}

export const BidResultScreen = createFragmentContainer(BidResult, {
  sale_artwork: graphql`
    fragment BidResult_sale_artwork on SaleArtwork {
      sale {
        liveStartAt
        endAt
        slug
      }
    }
  `,
})
