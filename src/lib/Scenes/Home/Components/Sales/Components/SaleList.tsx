import { isEmpty } from "lodash"
import React, { Component } from "react"
import { Dimensions, FlatList, LayoutChangeEvent, View } from "react-native"

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

interface State {
  screenWidth: number
}

export class SaleList extends Component<Props, State> {
  state = {
    screenWidth: 1,
  }

  onLayout = (event: LayoutChangeEvent) => {
    const screenWidth = event.nativeEvent.layout.width
    this.setState({ screenWidth })
  }

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
      <View style={style} onLayout={this.onLayout}>
        <SectionHeader title={section.title} style={{ paddingTop: this.props.section.isFirstItem ? 0 : 22 }} />
        <FlatList
          contentContainerStyle={{
            justifyContent: "space-between",
            padding: 5,
            display: "flex",
          }}
          data={item.data}
          numColumns={numColumns}
          keyExtractor={row => row.__id}
          renderItem={row => <SaleListItem key={row.index} sale={row.item} screenWidth={this.state.screenWidth} />}
        />
      </View>
    )
  }
}
