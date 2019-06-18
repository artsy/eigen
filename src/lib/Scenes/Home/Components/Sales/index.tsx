import React from "react"
import { RefreshControl, SectionList, StyleSheet } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import LotsByFollowedArtists from "./Components/LotsByFollowedArtists"
import { SaleList } from "./Components/SaleList"
import { ZeroState } from "./Components/ZeroState"

interface Props {
  relay: RelayRefetchProp
  viewer: {
    sales: Array<{
      href: string | null
      live_start_at: string | null
    }>
  }
}

interface State {
  isRefreshing: boolean
}

class Sales extends React.Component<Props, State> {
  state = {
    isRefreshing: false,
  }

  get data() {
    const { viewer } = this.props
    const liveAuctions = viewer.sales.filter(a => !!a.live_start_at)
    const timedAuctions = viewer.sales.filter(a => !a.live_start_at)

    return {
      liveAuctions,
      timedAuctions,
      viewer,
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
    if (this.props.viewer.sales.length === 0) {
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
        data: [{ data: this.data.viewer }],
        title: "Lots by Artists You Follow",
        renderItem: props => <LotsByFollowedArtists title={props.section.title} viewer={props.item.data} />,
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
    viewer: graphql`
      fragment Sales_viewer on Viewer {
        sales(live: true, is_auction: true, size: 100, sort: TIMELY_AT_NAME_ASC) {
          ...SaleListItem_sale
          href
          live_start_at
        }
        ...LotsByFollowedArtists_viewer
      }
    `,
  },
  graphql`
    query SalesQuery {
      viewer {
        ...Sales_viewer
      }
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
