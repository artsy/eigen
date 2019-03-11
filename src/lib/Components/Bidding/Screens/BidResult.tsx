import React from "react"
import { NativeModules, NavigatorIOS, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Icon20 } from "../Components/Icon"
import { Flex } from "../Elements/Flex"

import { Markdown } from "../../Markdown"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { BidGhostButton, Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { BidderPositionResult } from "../types"

import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"

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
  WINNING: require("../../../../../images/circle-check-green.png"),
  PENDING: require("../../../../../images/circle-exclamation.png"),
}

export class BidResult extends React.Component<BidResultProps> {
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
      const Emission = NativeModules.Emission || {}
      const saleID = this.props.sale_artwork.sale.id
      const url = `${Emission.predictionURL}/${saleID}`
      SwitchBoard.presentModalViewController(this, url)
    } else {
      SwitchBoard.dismissModalViewController(this)
    }
  }

  render() {
    const { sale_artwork, bidderPositionResult } = this.props
    const { live_start_at, end_at } = sale_artwork.sale
    const { status, message_header, message_description_md } = bidderPositionResult

    return (
      <BiddingThemeProvider>
        <Container mt={6}>
          <View>
            <Flex alignItems="center">
              <Icon20 source={Icons[status] || require("../../../../../images/circle-x-red.png")} />

              <Title mt={2} mb={5}>
                {status === "PENDING" ? messageForPollingTimeout.title : message_header || "You’re the highest bidder"}
              </Title>

              {status !== "WINNING" && (
                <Markdown mb={5}>
                  {status === "PENDING" ? messageForPollingTimeout.description : message_description_md}
                </Markdown>
              )}

              {this.shouldDisplayTimer(status) && <Timer liveStartsAt={live_start_at} endsAt={end_at} />}
            </Flex>
          </View>
          {this.canBidAgain(status) ? (
            <Button text="Bid again" onPress={() => this.onPressBidAgain()} />
          ) : (
            <BidGhostButton text="Continue" onPress={this.exitBidFlow} />
          )}
        </Container>
      </BiddingThemeProvider>
    )
  }

  private shouldDisplayTimer(status: string) {
    return SHOW_TIMER_STATUSES.indexOf(status) > -1
  }

  private canBidAgain(status: string) {
    return status === "OUTBID" || status === "RESERVE_NOT_MET"
  }
}

export const BidResultScreen = createFragmentContainer(
  BidResult,
  graphql`
    fragment BidResult_sale_artwork on SaleArtwork {
      minimum_next_bid {
        amount
        cents
        display
      }
      sale {
        live_start_at
        end_at
        id
      }
    }
  `
)
