import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { View } from "react-native"
import { LargeHeadline } from "../Typography"
import ActiveBid from "./ActiveBid"

const Container = styled.View`margin: 20px 0 40px;`

class ActiveBids extends React.Component<RelayProps, null> {
  hasContent() {
    if (!this.props.me) {
      return false
    }
    return this.props.me.lot_standings.length > 0
  }

  renderRows() {
    const me = this.props.me || { lot_standings: [] }
    const bids = me.lot_standings.map(bidData => {
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

export default Relay.createContainer(ActiveBids, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        lot_standings(active_positions: true) {
          active_bid {
            __id
          }
          ${ActiveBid.getFragment("bid")}
        }
      }
    `,
  },
})

interface RelayProps {
  me: {
    lot_standings: Array<{
      active_bid: {
        __id: string
      } | null
    } | null> | null
  }
}
