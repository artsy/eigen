import React, { Component } from "react"
import SaleListItem from "./SaleListItem"
import { Dimensions, FlatList } from "react-native"

export class SaleList extends Component<any> {
  render() {
    const numColumns = Dimensions.get("window").width > 700 ? 4 : 2

    return (
      <FlatList
        contentContainerStyle={{
          justifyContent: "space-between",
          padding: 5,
          display: "flex",
        }}
        data={this.props.item.data}
        numColumns={numColumns}
        keyExtractor={(item, index) => item.__id}
        renderItem={({ item, index }) => <SaleListItem key={index} sale={item} />}
      />
    )
  }
}
