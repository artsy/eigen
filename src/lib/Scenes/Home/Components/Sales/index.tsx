import { Sales_query } from "__generated__/Sales_query.graphql"
import React from "react"
import { RefreshControl, SectionList, StyleSheet } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import LotsByFollowedArtists from "./Components/LotsByFollowedArtists"
import { SaleList } from "./Components/SaleList"
import { ZeroState } from "./Components/ZeroState"

interface Props {
  relay: RelayRefetchProp
  query: Sales_query
}

interface State {
  isRefreshing: boolean
}

class Sales extends React.Component<Props, State> {
  state = {
    isRefreshing: false,
  }

  get data() {
    const sales = this.props.query.salesConnection.edges.map(({ node }) => node)
    const liveAuctions = sales.filter(a => !!a.live_start_at)
    const timedAuctions = sales.filter(a => !a.live_start_at)

    return {
      liveAuctions,
      timedAuctions,
    }
  }

  handleRefresh = () => {
    this.setState({ isRefreshing: true })
    this.props.relay.refetch(
      {},
      {},
      error => {
        if (error) {
          // FIXME: Handle error
          console.error("Sales/index.tsx", error.message)
        }
        this.setState({ isRefreshing: false })
      },
      { force: true }
    )
  }

  render() {
    if (this.props.query.salesConnection.edges.length === 0) {
      return <ZeroState />
    }

    const sections = [
      {
        data: [{ data: this.data.liveAuctions }],
        title: "Current Live Auctions",
        isFirstItem: true,
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.data.timedAuctions }],
        title: "Current Timed Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.props.query }],
        title: "Lots by Artists You Follow",
        renderItem: props => {
          return <LotsByFollowedArtists title={props.section.title} query={props.item.data} />
        },
      },
    ]

    return (
      <SectionList
        contentContainerStyle={SectionListStyles.contentContainer}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={() => undefined}
        refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
      />
    )
  }
}

export default createRefetchContainer(
  Sales,
  {
    query: graphql`
      fragment Sales_query on Query {
        salesConnection(live: true, isAuction: true, first: 100, sort: TIMELY_AT_NAME_ASC) {
          edges {
            node {
              ...SaleListItem_sale
              live_start_at: liveStartAt
            }
          }
        }
        ...LotsByFollowedArtists_query
      }
    `,
  },
  graphql`
    query SalesQuery {
      ...Sales_query
    }
  `
)

const SectionListStyles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
    paddingTop: 2,
    padding: 10,
    display: "flex",
  },
})
