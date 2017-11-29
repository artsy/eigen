import React from "react"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"
import { Dimensions, FlatList, SectionList, TouchableWithoutFeedback, View } from "react-native"
import { LotsByFollowedArtists } from "./Components/LotsByFollowedArtists"
<<<<<<< HEAD
import SaleItem from "./Components/SaleItem"

const Container = styled.View`
  flex: 1;
  padding: 10px 15px;
`

const SectionHeader = styled.View`
  padding-top: 15px;
  padding-bottom: 10px;
  background-color: white;
`

const SectionTitle = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 30px;
  text-align: left;
  margin-left: 2px;
`
=======
import { SaleList } from "./Components/SaleList"
import { SectionHeader } from "./Components/SectionHeader"
import { createFragmentContainer, graphql } from "react-relay"
>>>>>>> [Home] Modularize components

interface Props {
  sales: Array<{
    live_start_at: string | null
  }>
}

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
    const { liveAuctions, timedAuctions } = this.data

    const sections = [
      {
        data: [
          {
            data: liveAuctions,
          },
        ],
        title: "Current Live Auctions",
      },
      {
        data: [
          {
            data: timedAuctions,
          },
        ],
        title: "Current Timed Auctions",
      },
      {
        data: [
          {
            data: [],
          },
        ],
        renderItem: () => <LotsByFollowedArtists />,
      },
    ]

    return (
      <SectionList
        contentContainerStyle={{
          justifyContent: "space-between",
          padding: 10,
          display: "flex",
        }}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item, index) => item.id}
        renderItem={itemData => <SaleList {...itemData} />}
        renderSectionHeader={SectionHeader}
      />
    )
  }
}

export default createFragmentContainer(Sales, {
  sales: graphql`
    fragment Sales_sales on Sale @relay(plural: true) {
      ...SaleItem_sale
      live_start_at
      href
    }
  `,
})
