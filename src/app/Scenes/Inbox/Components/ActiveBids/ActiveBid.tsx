import { Image } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ActiveBid_bid$data } from "__generated__/ActiveBid_bid.graphql"
import { BodyText, MetadataText } from "app/Scenes/Inbox/Components/Typography"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Container = styled.View`
  height: 120px;
  margin-left: 20px;
  margin-right: 20px;
  ${isTablet() ? "align-self: center; width: 708;" : ""};
`

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const ImageView = styled(Image)`
  border-radius: 4px;
`

const MetadataContainer = styled.View`
  margin: 0 10px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${themeGet("colors.mono10")};
`

const StatusLabel = styled(MetadataText)`
  margin-bottom: 3px;
  color: ${(props: { status: BidStatus }) => {
    switch (props.status) {
      case "winning":
        return themeGet("colors.green100")
      case "reserve":
        return themeGet("colors.copper100")
      case "losing":
        return themeGet("colors.red100")
      case "live_active":
        return themeGet("colors.blue100")
      case "live_auction":
        return themeGet("colors.mono60")
    }
  }};
`

type BidStatus = "winning" | "reserve" | "losing" | "live_active" | "live_auction"

interface Props {
  bid: ActiveBid_bid$data
}

interface State {
  status: BidStatus
}

class ActiveBid extends React.Component<Props, State> {
  state = {
    status: "losing" as BidStatus,
  }

  componentDidMount() {
    this.updateStatus()
  }

  updateStatus() {
    const bid = this.props.bid
    const isInLiveOpenAuction = bid?.sale?.isLiveOpen
    const isInLiveAuction = bid?.sale?.isLiveOpenHappened

    let status: BidStatus = "losing"
    if (isInLiveOpenAuction) {
      status = "live_active"
    } else if (isInLiveAuction) {
      status = "live_auction"
    } else {
      const leadingBidder = bid.is_leading_bidder
      const reserveNotMet = bid?.most_recent_bid?.sale_artwork?.reserve_status === "reserve_not_met"

      if (leadingBidder) {
        status = reserveNotMet ? "reserve" : "winning"
      }
    }

    this.setState({ status })
  }

  get statusLabel(): string {
    switch (this.state.status) {
      case "live_active":
        return "Join Live"
      case "live_auction":
        return "Live auction"
      case "winning":
      case "reserve":
        return "Highest Bid"
      case "losing":
        return "Outbid"
    }
  }

  handleTap = () => {
    const bid = this.props.bid
    // push user into live auction if it's open; otherwise go to artwork
    const href =
      this.state.status === "live_active" || this.state.status === "live_auction"
        ? bid?.sale?.href
        : bid?.most_recent_bid?.sale_artwork?.artwork?.href

    if (href) {
      navigate(href)
    } else {
      console.warn("ActiveBid: no href found")
    }
  }

  render() {
    const bid = this.props.bid.most_recent_bid
    const imageURL = bid?.sale_artwork?.artwork?.image?.url
    const blurhash = bid?.sale_artwork?.artwork?.image?.blurhash

    const lotNumber = bid?.sale_artwork?.lot_label || ""
    const artistName = bid?.sale_artwork?.artwork?.artist_names || ""

    const headline = `Lot ${lotNumber} · ${artistName} `

    const isInOpenLiveAuction = this.props.bid.sale && this.props.bid.sale.isLiveOpen
    const isInLiveAuction = this.props.bid.sale && this.props.bid.sale.isLiveOpenHappened
    const bidderPositions = bid?.sale_artwork?.counts?.bidder_positions || null
    const bidderPositionsLabel = bidderPositions + " " + (bidderPositions === 1 ? "Bid" : "Bids")

    const subtitle = isInOpenLiveAuction
      ? "Live bidding now open"
      : isInLiveAuction
        ? "Live auction"
        : `${bid?.sale_artwork?.highest_bid?.display || ""} (${
            bidderPositions ? bidderPositionsLabel : ""
          })`

    return (
      <TouchableWithoutFeedback accessibilityRole="button" onPress={this.handleTap}>
        <Container>
          <Content>
            <ImageView src={imageURL} blurhash={blurhash} width={80} height={80} />
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

export default createFragmentContainer(ActiveBid, {
  bid: graphql`
    fragment ActiveBid_bid on LotStanding {
      is_leading_bidder: isLeadingBidder
      sale {
        href
        isLiveOpen
        isLiveOpenHappened
      }
      most_recent_bid: mostRecentBid {
        id
        sale_artwork: saleArtwork {
          artwork {
            href
            image {
              url
              blurhash
            }
            artist_names: artistNames
          }
          counts {
            bidder_positions: bidderPositions
          }
          highest_bid: highestBid {
            display
          }
          lot_label: lotLabel
          reserve_status: reserveStatus
        }
      }
    }
  `,
})
