import fonts from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Dimensions, FlatList, SectionList, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { LotsByFollowedArtists } from "./Components/LotsByFollowedArtists"
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

interface Props {
  sales: Array<{
    live_start_at: string | null
  }>
}

class Sales extends React.Component<Props, null> {
  handleTap({ item }) {
    Switchboard.presentNavigationViewController(this, item.href)
  }

  renderList(itemData) {
    const numColumns = Dimensions.get("window").width > 700 ? 4 : 2
    return (
      <FlatList
        contentContainerStyle={{ justifyContent: "space-between", padding: 5, display: "flex" }}
        data={itemData.data}
        numColumns={numColumns}
        keyExtractor={(item, index) => item.__id}
        renderItem={d => {
          return (
            <TouchableWithoutFeedback onPress={this.handleTap.bind(this, d)}>
              <View style={{ marginRight: 10, marginBottom: 10 }}>
                <SaleItem key={d.index} sale={d.item} />
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      />
    )
  }

  render() {
    const sales = this.props.sales
    const liveAuctions = sales.filter(a => !!a.live_start_at)
    const timedAuctions = sales.filter(a => !a.live_start_at)
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
        title: "Lots by Artists You Follow",
        renderItem: props => {
          return <LotsByFollowedArtists />
        },
      },
    ]

    return (
      <SectionList
        contentContainerStyle={{
          justifyContent: "space-between",
          padding: 15,
          display: "flex",
        }}
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

export default createFragmentContainer(Sales, {
  sales: graphql`
    fragment Sales_sales on Sale @relay(plural: true) {
      ...SaleItem_sale
      live_start_at
      href
    }
  `,
})
