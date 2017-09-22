import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { TouchableWithoutFeedback } from "react-native"

import { BodyText, MetadataText } from "../Typography"

import colors from "../../../../data/colors"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import OpaqueImageView from "../../OpaqueImageView"

const Container = styled.View`
  margin: 17px 20px 0;
  height: 80px;
`

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const ImageView = styled(OpaqueImageView)`
  width: 58px;
  height: 58px;
  border-radius: 4;
`

const MetadataContainer = styled.View`
  margin: 0 15px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${colors["gray-regular"]};
  margin-top: 17px;
`

const StatusLabel = styled(MetadataText)`
  color: ${(props: { status: BidStatus }) => {
    switch (props.status) {
      case "winning":
        return colors["green-regular"]
      case "reserve":
        return colors["yellow-regular"]
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
      const reserveNotMet = bid.active_bid.sale_artwork.reserve_status === "reserve_not_met"

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
    const href = this.state.status === "live_auction" ? bid.sale.href : bid.active_bid.sale_artwork.artwork.href
    SwitchBoard.presentNavigationViewController(this, href)
  }

  render() {
    const bid = this.props.bid.active_bid
    const imageURL = bid.sale_artwork.artwork.image.url
    const lotNumber = bid.sale_artwork.lot_number
    const artistName = bid.sale_artwork.artwork.artist_names

    const headline = `Lot ${lotNumber} · ${artistName} `

    const isInOpenLiveAuction = this.props.bid.sale && this.props.bid.sale.is_live_open
    const subtitle = isInOpenLiveAuction ? "Live bidding now open" : `Current Bid: ${bid.max_bid.display} `

    return (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        <Container>
          <Content>
            <ImageView imageURL={imageURL} />
            <MetadataContainer>
              <BodyText>
                {headline}
              </BodyText>
              <BodyText>
                {subtitle}
              </BodyText>
            </MetadataContainer>
            <StatusLabel status={this.state.status}>
              {this.statusLabel}
            </StatusLabel>
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
      active_bid {
        max_bid {
          display
        }
        sale_artwork {
          lot_number
          reserve_status
          artwork {
            href
            image {
              url
            }
            artist_names
          }
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
    active_bid: {
      max_bid: {
        display: string | null
      } | null
      sale_artwork: {
        lot_number: string | null
        reserve_status: string | null
        artwork: {
          href: string | null
          image: {
            url: string | null
          } | null
          artist_names: string | null
        } | null
      } | null
    } | null
  }
}
