import { isEmpty } from "lodash"
import React, { Component } from "react"
import { Dimensions, FlatList, View } from "react-native"

import SaleListItem from "./SaleListItem"
import { SectionHeader } from "./SectionHeader"

interface Props {
  item: {
    data: any[]
  }
  section: {
    isFirstItem?: boolean
    title: string
  }
}

export class SaleList extends Component<Props> {
  render() {
    const { item, section } = this.props
    const numColumns = Dimensions.get("window").width > 700 ? 4 : 2

    if (isEmpty(item.data)) {
      return null
    }

    const style = {
      marginTop: section.isFirstItem ? -9 : 0, // Offset spaced section headers
    }

    return (
      <View style={style}>
        <SectionHeader title={section.title} />
        <FlatList
          contentContainerStyle={{
            justifyContent: "space-between",
            padding: 5,
            display: "flex",
          }}
          data={item.data}
          numColumns={numColumns}
          keyExtractor={row => row.__id}
          renderItem={row => <SaleListItem key={row.index} sale={row.item} />}
        />
      </View>
    )
  }
}
