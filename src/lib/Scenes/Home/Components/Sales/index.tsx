import fonts from "lib/data/fonts"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import { Dimensions, FlatList, SectionList, Text, TouchableWithoutFeedback, View } from "react-native"
import { StyleSheet, TextStyle } from "react-native"
import {
  createFragmentContainer,
  createPaginationContainer,
  graphql,
  QueryRenderer,
  QueryRendererProps,
} from "react-relay"
import { RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { LotsByFollowedArtists } from "./Components/LotsByFollowedArtists"
import { SaleList } from "./Components/SaleList"
import { SectionHeader } from "./Components/SectionHeader"

interface Props {
  relay?: RelayPaginationProp
  sales: Array<{
    live_start_at: string | null
  }>
  viewer?: {
    sale_artworks: {
      pageInfo: object | null
      edges: Array<{
        node: object | null
      }> | null
    }
  }
}

const SectionListStyles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
    padding: 10,
    display: "flex",
  },
})

class Sales extends React.Component<Props> {
  get data() {
    const { sales, viewer: { sale_artworks } } = this.props
    const liveAuctions = sales.filter(a => !!a.live_start_at)
    const timedAuctions = sales.filter(a => !a.live_start_at)

    return {
      liveAuctions,
      timedAuctions,
      sale_artworks,
    }
  }

  render() {
    const { relay } = this.props

    const sections = [
      {
        data: [{ data: this.data.liveAuctions }],
        title: "Current Live Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.data.timedAuctions }],
        title: "Current Timed Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.data.sale_artworks }],
        title: "Lots by Artists You Follow",
        renderItem: props => <LotsByFollowedArtists saleArtworks={props.item.data} relay={relay} />,
      },
    ]

    return (
      <SectionList
        contentContainerStyle={SectionListStyles.contentContainer}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item, index) => item.id}
      />
    )
  }
}

export default createPaginationContainer(
  Sales,
  {
    sales: graphql`
      fragment Sales_sales on Sale @relay(plural: true) {
        ...SaleListItem_sale
        live_start_at
        href
      }
    `,
    viewer: graphql.experimental`
      fragment Sales_viewer on Viewer @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" }) {
        sale_artworks(first: $count, after: $cursor, include_artworks_by_followed_artists: true)
          @connection(key: "LotsByFollowedArtists_sale_artworks") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              is_biddable
              artwork {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ viewer }) => viewer && viewer.sale_artworks,
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (props, { count, cursor }) => ({ count, cursor }),
    query: graphql.experimental`
      query SalesQuery($count: Int!, $cursor: String) {
        viewer {
          ...Sales_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
