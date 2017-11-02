import * as React from "react"
import { FlatList, SectionList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import SectionTitle from "../SectionTitle"
import AuctionItem from "./Components/AuctionItem"

const Container = styled.View`
  flex: 1;
  padding: 10px;
`

class Auctions extends React.Component<any, any> {
  renderList(itemData) {
    return (
      <FlatList
        data={itemData.data}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        renderItem={d => {
          return <AuctionItem key={d.index} auction={d.item} />
        }}
      />
    )
  }

  render() {
    const auctions = this.props.auctions
    const liveAuctions = auctions.filter(a => !!a.live_start_at)
    const timedAuctions = auctions.filter(a => !a.live_start_at)

    return (
      <Container>
        <SectionList
          contentContainerStyle={{ justifyContent: "center", padding: 5, display: "flex" }}
          sections={[
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
          ]}
          keyExtractor={(item, index) => item.id}
          renderItem={itemData => {
            return (
              <View style={{ flex: 1, alignContent: "center" }}>
                {this.renderList(itemData.item)}
              </View>
            )
          }}
          renderSectionHeader={({ section }) =>
            <View style={{ paddingTop: 15, backgroundColor: "white" }}>
              <SectionTitle>
                {section.title}
              </SectionTitle>
            </View>}
        />
      </Container>
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
