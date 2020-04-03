import { Box, Flex, Sans, Separator } from "@artsy/palette"
import { Sales_data } from "__generated__/Sales_data.graphql"
import { SalesRendererQuery } from "__generated__/SalesRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { RefreshControl, SectionList, StyleSheet, View } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import LotsByFollowedArtists from "./Components/LotsByFollowedArtists"
import { SaleList } from "./Components/SaleList"
import { ZeroState } from "./Components/ZeroState"

interface Props {
  relay: RelayRefetchProp
  data: Sales_data
}

interface State {
  isRefreshing: boolean
}

class Sales extends React.Component<Props, State> {
  state = {
    isRefreshing: false,
  }

  get data() {
    const sales = this.props.data.salesConnection.edges.map(({ node }) => node)
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
          console.error("Sales/index.tsx", error.message)
        }
        this.setState({ isRefreshing: false })
      },
      { force: true }
    )
  }

  render() {
    console.log({ relay: this.props.relay, thing: this.props.data })
    return null

    if (this.props.data.salesConnection.edges.length === 0) {
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
        data: [{ data: this.props.data }],
        title: "Lots by Artists You Follow",
        renderItem: props => {
          return <LotsByFollowedArtists title={props.section.title} query={props.item.data} />
        },
      },
    ]

    return (
      <View>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <Sans size="4">New Works for You</Sans>
          </Flex>
        </Box>
        <Separator />
        <SectionList
          contentContainerStyle={SectionListStyles.contentContainer}
          stickySectionHeadersEnabled={false}
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={() => undefined}
          refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
        />
      </View>
    )
  }
}

const SectionListStyles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
    paddingTop: 2,
    padding: 10,
    display: "flex",
  },
})

export const SalesFragmentContainer = createRefetchContainer(
  Sales,
  {
    data: graphql`
      fragment Sales_data on Query {
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
      ...Sales_data
    }
  `
)

export const SalesRenderer: React.FC = () => {
  return (
    <QueryRenderer<SalesRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SalesRendererQuery {
          ...Sales_data
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(SalesFragmentContainer)}
    />
  )
}
