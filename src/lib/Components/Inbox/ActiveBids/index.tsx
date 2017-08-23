import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay/compat"
import styled from "styled-components/native"

import { View } from "react-native"
import { LargeHeadline } from "../Typography"
import ActiveBid from "./ActiveBid"

const Container = styled.View`margin: 20px 0 40px;`

class ActiveBids extends React.Component<RelayProps, null> {
  hasContent() {
    return this.props.me.lot_standings.length > 0
  }

  renderRows() {
    const bids = this.props.me.lot_standings.map(bidData => {
      return <ActiveBid key={bidData.active_bid.__id} bid={bidData} />
    })
    return bids
  }

  render() {
    return this.hasContent()
      ? <Container>
          <LargeHeadline>Active Bids</LargeHeadline>
          {this.renderRows()}
        </Container>
      : null
  }
}

export default createFragmentContainer(
  ActiveBids,
  graphql`
    fragment ActiveBids_me on Me {
      lot_standings(active_positions: true) {
        active_bid {
          __id
        }
        ...ActiveBid_bid
      }
    }
  `
)

interface RelayProps {
  me: {
    lot_standings: Array<{
      active_bid: {
        __id: string
      } | null
    } | null> | null
  }
}
