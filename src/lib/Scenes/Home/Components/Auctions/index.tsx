import * as React from "react"
import { FlatList, SectionList, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import fonts from "../../../../../data/fonts"
import { AuctionItem } from "./Components/AuctionItem"

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
  font-size: 25px;
  text-align: left;
  margin-left: 2px;
`

interface Props {
  auctions: Array<{
    live_start_at: string | null
  }>
}

class Auctions extends React.Component<Props, null> {
  handleTap(item) {
    console.log(item)
  }

  renderList(itemData) {
    return (
      <FlatList
        contentContainerStyle={{ justifyContent: "space-between", padding: 5, display: "flex" }}
        data={itemData.data}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        renderItem={d => {
          return (
            <TouchableWithoutFeedback onPress={this.handleTap.bind(this, d)}>
              <View style={{ marginRight: 10, marginBottom: 10 }}>
                <AuctionItem key={d.index} auction={d.item} />
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      />
    )
  }

  render() {
    const auctions = this.props.auctions
    const liveAuctions = auctions.filter(a => !!a.live_start_at)
    const timedAuctions = auctions.filter(a => !a.live_start_at)
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
    ]

    return (
      <SectionList
        contentContainerStyle={{ justifyContent: "space-between", padding: 15, display: "flex" }}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item, index) => item.id}
        renderItem={itemData => {
          return this.renderList(itemData.item)
        }}
        renderSectionHeader={({ section }) =>
          <SectionHeader>
            <SectionTitle>
              {section.title}
            </SectionTitle>
          </SectionHeader>}
      />
    )
  }
}

export default createFragmentContainer(Auctions, {
  auctions: graphql`
    fragment Auctions_auctions on Sale @relay(plural: true) {
      ...AuctionItem_auction @relay(mask: false)
    }
  `,
})
