import OpaqueImageView from "lib/Components/OpaqueImageView"
import colors from "lib/data/colors"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { BodyText, MetadataText } from "../Typography"

const isPad = Dimensions.get("window").width > 700

const Container = styled.View`
  height: 120px;
  margin-left: 20px;
  margin-right: 20px;
  ${isPad ? "align-self: center; width: 708;" : ""};
`

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 4;
`

const MetadataContainer = styled.View`
  margin: 0 10px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${colors["gray-regular"]};
`

const StatusLabel = styled(MetadataText)`
  margin-bottom: 3px;
  color: ${(props: { status: BidStatus }) => {
    switch (props.status) {
      case "winning":
        return colors["green-regular"]
      case "reserve":
        return colors["yellow-bold"]
      case "losing":
        return colors["red-regular"]
      case "live_auction":
        return colors["purple-regular"]
    }
  }};
`

type BidStatus = "winning" | "reserve" | "losing" | "live_auction"

interface State {
  status: BidStatus
}

class ActiveBid extends React.Component<RelayProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      status: "losing",
    }

    this.handleTap = this.handleTap.bind(this)
  }

  componentDidMount() {
    this.updateStatus()
  }

  updateStatus() {
    const bid = this.props.bid
    const isInLiveOpenAuction = bid.sale && bid.sale.is_live_open

    let status: BidStatus = "losing"
    if (isInLiveOpenAuction) {
      status = "live_auction"
    } else {
      const leadingBidder = bid.is_leading_bidder
      const reserveNotMet = bid.most_recent_bid.sale_artwork.reserve_status === "reserve_not_met"

      if (leadingBidder) {
        status = reserveNotMet ? "reserve" : "winning"
      }
    }

    this.setState({ status })
  }

  get statusLabel(): string {
    switch (this.state.status) {
      case "live_auction":
        return "Join Live"
      case "winning":
      case "reserve":
        return "Highest Bid"
      case "losing":
        return "Outbid"
    }
  }

  handleTap() {
    const bid = this.props.bid
    // push user into live auction if it's open; otherwise go to artwork
    const href = this.state.status === "live_auction" ? bid.sale.href : bid.most_recent_bid.sale_artwork.artwork.href
    SwitchBoard.presentNavigationViewController(this, href)
  }

  render() {
    const bid = this.props.bid.most_recent_bid
    const imageURL = bid.sale_artwork.artwork.image.url
    const lotNumber = bid.sale_artwork.lot_number
    const artistName = bid.sale_artwork.artwork.artist_names

    const headline = `Lot ${lotNumber} · ${artistName} `

    const isInOpenLiveAuction = this.props.bid.sale && this.props.bid.sale.is_live_open
    const bidderPositions = bid.sale_artwork.counts.bidder_positions
    const bidderPositionsLabel = bidderPositions + " " + (bidderPositions === 1 ? "Bid" : "Bids")

    const subtitle = isInOpenLiveAuction
      ? "Live bidding now open"
      : `${bid.sale_artwork.highest_bid.display} (${bidderPositionsLabel})`

    return (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        <Container>
          <Content>
            <ImageView imageURL={imageURL} />
            <MetadataContainer>
              <StatusLabel status={this.state.status}>{this.statusLabel}</StatusLabel>
              <BodyText>{headline}</BodyText>
              <BodyText>{subtitle}</BodyText>
            </MetadataContainer>
          </Content>
          <Separator />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

export default createFragmentContainer(
  ActiveBid,
  graphql`
    fragment ActiveBid_bid on LotStanding {
      is_leading_bidder
      sale {
        href
        is_live_open
      }
      most_recent_bid {
        __id
        max_bid {
          display
        }
        sale_artwork {
          artwork {
            href
            image {
              url
            }
            artist_names
          }
          counts {
            bidder_positions
          }
          highest_bid {
            display
          }
          lot_number
          reserve_status
        }
      }
    }
  `
)

interface RelayProps {
  bid: {
    is_leading_bidder: boolean | null
    sale: {
      href: string | null
      is_live_open: boolean | null
    } | null
    most_recent_bid: {
      max_bid: {
        display: string | null
      } | null
      sale_artwork: {
        artwork: {
          href: string | null
          image: {
            url: string | null
          } | null
          artist_names: string | null
        } | null
        counts: {
          bidder_positions: number | null
        } | null
        highest_bid: {
          display: string | null
        } | null
        lot_number: string | null
        reserve_status: string | null
      } | null
    } | null
  }
}
