import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import { LargeHeadline } from "../Typography"
import ActiveBid from "./ActiveBid"

const Container = styled.View`
  margin-top: 20px;
  margin-bottom: 40px;
`

const Headline = styled(LargeHeadline)`
margin-bottom: -10px;
`

interface Props extends RelayProps {
  relay?: RelayRefetchProp
}

interface State {
  fetchingData: boolean
}

class ActiveBids extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      fetchingData: false,
    }

    this.refreshActiveBids = this.refreshActiveBids.bind(this)
  }

  hasContent() {
    return this.props.me.lot_standings.length > 0
  }

  renderRows() {
    const bids = this.props.me.lot_standings.map(bidData => {
      return <ActiveBid key={bidData.most_recent_bid.__id} bid={bidData} />
    })
    return bids
  }

  refreshActiveBids(callback) {
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
    return this.hasContent()
      ? <Container>
          <Headline>Active Bids</Headline>
          {this.renderRows()}
        </Container>
      : null
  }
}

export default createRefetchContainer(
  ActiveBids,
  {
    me: graphql`
      fragment ActiveBids_me on Me {
        lot_standings(live: true) {
          most_recent_bid {
            __id
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
) as React.ComponentClass<Props>

interface RelayProps {
  me: {
    lot_standings: Array<{
      most_recent_bid: {
        __id: string
      } | null
    } | null> | null
  }
}
