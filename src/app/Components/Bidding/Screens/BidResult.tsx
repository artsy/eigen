import { Button } from "@artsy/palette-mobile"
import { BidResult_sale_artwork$data } from "__generated__/BidResult_sale_artwork.graphql"
import { Container } from "app/Components/Bidding/Components/Containers"
import { Icon20 } from "app/Components/Bidding/Components/Icon"
import { Timer } from "app/Components/Bidding/Components/Timer"
import { Title } from "app/Components/Bidding/Components/Title"
import { Flex } from "app/Components/Bidding/Elements/Flex"
import { BidderPositionResult } from "app/Components/Bidding/types"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Markdown } from "app/Components/Markdown"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { BackHandler, ImageRequireSource, NativeEventSubscription, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const SHOW_TIMER_STATUSES = ["WINNING", "OUTBID", "RESERVE_NOT_MET"]

interface BidResultProps {
  sale_artwork: BidResult_sale_artwork$data
  bidderPositionResult: BidderPositionResult
  navigator: NavigatorIOS
  refreshBidderInfo?: () => void
  refreshSaleArtwork?: () => void
  biddingEndAt?: string
}

const messageForPollingTimeout = {
  title: "Bid processing",
  description:
    "We’re receiving a high volume of traffic\n" +
    "and your bid is still processing.\n\n" +
    "If you don’t receive an update soon,\n" +
    "please contact [support@artsy.net](mailto:support@artsy.net).",
}

const Icons: Record<string, ImageRequireSource> = {
  WINNING: require("images/circle-check-green.webp"),
  PENDING: require("images/circle-exclamation.webp"),
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
      const saleSlug = this.props.sale_artwork.sale?.slug
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
    const { status, message_header, message_description_md } = bidderPositionResult

    return (
      <View style={{ flex: 1 }}>
        <FancyModalHeader useXButton onLeftButtonPress={() => dismissModal()} />
        <Container mt={6}>
          <View>
            <Flex alignItems="center">
              <Icon20 source={Icons[status] || require("images/circle-x-red.webp")} />
              <Title mt={2} mb={6}>
                {status === "PENDING"
                  ? messageForPollingTimeout.title
                  : message_header || "You’re the highest bidder"}
              </Title>
              {status !== "WINNING" && (
                <Markdown mb={6}>
                  {status === "PENDING"
                    ? messageForPollingTimeout.description
                    : message_description_md}
                </Markdown>
              )}
              {!!this.shouldDisplayTimer(status) && (
                <Timer
                  liveStartsAt={sale_artwork.sale?.liveStartAt ?? undefined}
                  lotEndAt={sale_artwork.endAt}
                  biddingEndAt={this.props.biddingEndAt}
                />
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
      endAt
      extendedBiddingEndAt
      sale {
        liveStartAt
        endAt
        slug
        cascadingEndTimeIntervalMinutes
      }
    }
  `,
})
