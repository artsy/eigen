import { Box, Flex, Sans, Separator, Theme } from "@artsy/palette"
import { Sales_me } from "__generated__/Sales_me.graphql"
import { Sales_sales } from "__generated__/Sales_sales.graphql"
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
  sales: Sales_sales
  me: Sales_me
}

interface State {
  isRefreshing: boolean
}

class Sales extends React.Component<Props, State> {
  state = {
    isRefreshing: false,
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
    if (this.props.sales.edges.length === 0) {
      return <ZeroState />
    }

    const sales = this.props.sales.edges.map(({ node }) => node)
    const data = {
      liveAuctions: sales.filter(a => !!a.live_start_at),
      timedAuctions: sales.filter(a => !a.live_start_at),
    }

    const sections = [
      {
        data: [{ data: data.liveAuctions }],
        title: "Current Live Auctions",
        isFirstItem: true,
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: data.timedAuctions }],
        title: "Current Timed Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.props.me }],
        title: "Lots by Artists You Follow",
        renderItem: props => {
          return <LotsByFollowedArtists title={props.section.title} me={props.item.data} />
        },
      },
    ]

    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <Box mb={1} mt={2}>
            <Flex alignItems="center">
              <Sans size="4">Auctions</Sans>
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
      </Theme>
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
    sales: graphql`
      fragment Sales_sales on SaleConnection {
        edges {
          node {
            ...SaleListItem_sale
            live_start_at: liveStartAt
          }
        }
      }
    `,
    me: graphql`
      fragment Sales_me on Me {
        ...LotsByFollowedArtists_me
        email
      }
    `,
  },
  graphql`
    query SalesQuery {
      sales: salesConnection(live: true, isAuction: true, first: 100, sort: TIMELY_AT_NAME_ASC) {
        ...Sales_sales
      }
      me {
        ...Sales_me
      }
    }
  `
)

export const SalesRenderer: React.FC = () => {
  return (
    <QueryRenderer<SalesRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SalesRendererQuery {
          sales: salesConnection(live: true, isAuction: true, first: 100, sort: TIMELY_AT_NAME_ASC) {
            ...Sales_sales
          }
          me {
            ...Sales_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(SalesFragmentContainer)}
    />
  )
}
