import React from "react"
import createEnvironment from "lib/relay/createEnvironment"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"
import { Dimensions, FlatList, SectionList, TouchableWithoutFeedback, View } from "react-native"
import { LotsByFollowedArtists } from "./Components/LotsByFollowedArtists"
import { QueryRenderer, QueryRendererProps, createFragmentContainer, graphql } from "react-relay"
import { SaleList } from "./Components/SaleList"
import { SectionHeader } from "./Components/SectionHeader"
import { StyleSheet, TextStyle } from "react-native"

interface Props {
  sales: Array<{
    live_start_at: string | null
  }>
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
    const { sales } = this.props
    const liveAuctions = sales.filter(a => !!a.live_start_at)
    const timedAuctions = sales.filter(a => !a.live_start_at)

    return {
      liveAuctions,
      timedAuctions,
    }
  }

  render() {
    const sections = [
      {
        data: [{ data: this.data.liveAuctions }],
        title: "Current Live Auctions",
        renderItem: itemData => <SaleList {...itemData} />,
      },
      {
        data: [{ data: this.data.timedAuctions }],
        title: "Current Timed Auctions",
        renderItem: itemData => <SaleList {...itemData} />,
      },
      {
        data: [{ data: [] }],
        title: "Lots by Artists You Follow",
        renderItem: () => <LotsByFollowedArtists />,
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

export function SalesRenderer({ render }) {
  return (
    <QueryRenderer
      environment={createEnvironment()}
      query={graphql`
        query SalesRendererQuery {
          sales: sales(live: true, is_auction: true) {
            ...Sales_sales
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

export default createFragmentContainer(Sales, {
  sales: graphql`
    fragment Sales_sales on Sale @relay(plural: true) {
      ...SaleListItem_sale
      live_start_at
      href
    }
  `,
})
