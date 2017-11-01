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
  render() {
    const auctions = this.props.auctions

    return (
      <Container>
        <SectionList
          contentContainerStyle={{ justifyContent: "center", padding: 5 }}
          sections={[
            {
              data: auctions,
              title: "Timed Live Auctions",
            },
          ]}
          keyExtractor={(item, index) => item.id}
          renderItem={itemData => {
            return (
              <View style={{ flex: 1, margin: 1, alignContent: "center" }}>
                <AuctionItem key={itemData.index} auction={itemData.item} />
              </View>
            )
          }}
          renderSectionHeader={({ section }) =>
            <SectionTitle>
              {section.title}
            </SectionTitle>}
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
