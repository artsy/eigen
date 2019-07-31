import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import { LargeHeadline } from "../Typography"
import ActiveBid from "./ActiveBid"

import { ActiveBids_me } from "__generated__/ActiveBids_me.graphql"

const Container = styled.View`
  margin-top: 20px;
  margin-bottom: 40px;
`

const Headline = styled(LargeHeadline)`
  margin-bottom: -10px;
`

interface Props {
  relay: RelayRefetchProp
  me: ActiveBids_me
}

interface State {
  fetchingData: boolean
}

export class ActiveBids extends React.Component<Props, State> {
  state = {
    fetchingData: false,
  }

  hasContent() {
    return this.props.me.lot_standings.length > 0
  }

  renderRows() {
    const bids = this.props.me.lot_standings.map(bidData => {
      return <ActiveBid key={bidData.most_recent_bid.id} bid={bidData as any} />
    })
    return bids
  }

  refreshActiveBids = (callback?: () => void) => {
    if (this.state.fetchingData) {
      return
    }

    this.setState({
      fetchingData: true,
    })

    const onFetchComplete = error => {
      if (error) {
        // FIXME: Handle error
        console.error("ActiveBids/index.tsx", error.message)
      }

      this.setState({
        fetchingData: false,
      })

      if (callback) {
        callback()
      }
    }

    this.props.relay.refetch({}, {}, onFetchComplete, { force: true })
  }

  render() {
    return this.hasContent() ? (
      <Container>
        <Headline>Active Bids</Headline>
        {this.renderRows()}
      </Container>
    ) : null
  }
}

export default createRefetchContainer(
  ActiveBids,
  {
    me: graphql`
      fragment ActiveBids_me on Me {
        lot_standings: lotStandings(live: true) {
          most_recent_bid: mostRecentBid {
            id
          }
          ...ActiveBid_bid
        }
      }
    `,
  },
  graphql`
    query ActiveBidsRefetchQuery {
      me {
        ...ActiveBids_me
      }
    }
  `
)
