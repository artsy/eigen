import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { TouchableWithoutFeedback } from "react-native"
import { BodyText, MetadataText } from "../Typography"

import colors from "../../../../data/colors"
import OpaqueImageView from "../../OpaqueImageView"

const Container = styled.View`
  margin: 17px 20px 0px;
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
    }
  }};
`

type BidStatus = "winning" | "reserve" | "losing"

interface State {
  status: BidStatus
}

class ActiveBid extends React.Component<RelayProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      status: "losing",
    }
  }

  componentDidMount() {
    this.updateStatus()
  }

  updateStatus() {
    const bid = this.props.bid
    const leadingBidder = bid.is_leading_bidder
    const reserveNotMet = bid.active_bid.sale_artwork.reserve_status === "reserve_not_met"

    let status: BidStatus = "losing"
    if (leadingBidder) {
      status = reserveNotMet ? "reserve" : "winning"
    }

    this.setState({ status })
  }

  get statusLabel(): string {
    switch (this.state.status) {
      case "winning":
      case "reserve":
        return "Highest Bid"
      case "losing":
        return "Outbid"
    }
  }

  render() {
    const bid = this.props.bid.active_bid
    const imageURL = bid.sale_artwork.artwork.image.url
    const lotNumber = bid.sale_artwork.lot_number
    const artistName = bid.sale_artwork.artwork.artist_names

    const headline = `Lot ${lotNumber} · ${artistName} `
    const subtitle = `Current Bid: ${bid.max_bid.display} `

    return (
      <TouchableWithoutFeedback>
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

export default Relay.createContainer(ActiveBid, {
  fragments: {
    bid: () => Relay.QL`
      fragment on LotStanding {
        is_leading_bidder
        active_bid {
          id
          max_bid {
            cents
            display
          }
          sale_artwork {
            lot_label
            lot_number
            position
            reserve_status
            counts {
              bidder_positions
            }
            sale {
              live_start_at
              end_at
              is_live_open
              is_closed
            }
            highest_bid {
              cents
              display
            }
            artwork {
              id
              title
              image {
                url
              }
              artist_names
            }
          }
        }
      }
    `,
  },
})

interface RelayProps {
  bid: {
    is_leading_bidder: boolean | null
    active_bid: {
      id: string
      max_bid: {
        cents: number | null
        display: string | null
      } | null
      sale_artwork: {
        lot_label: string | null
        lot_number: string | null
        position: number | null
        reserve_status: string | null
        counts: {
          bidder_positions: boolean | number | string | null
        } | null
        sale: {
          live_start_at: string | null
          end_at: string | null
          is_live_open: boolean | null
          is_closed: boolean | null
        } | null
        highest_bid: {
          cents: number | null
          display: string | null
        } | null
        artwork: {
          id: string
          title: string | null
          image: {
            url: string | null
          } | null
          artist_names: string | null
        } | null
      } | null
    } | null
  }
}
