import { isEmpty } from "lodash"
import React, { Component } from "react"
import { FlatList, LayoutChangeEvent, View } from "react-native"

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
  columnCount: number
  columnWidth: number
}

export class SaleList extends Component<Props, State> {
  state = {
    columnCount: 0,
    columnWidth: 0,
  }

  onLayout = (event: LayoutChangeEvent) => {
    const screenWidth = event.nativeEvent.layout.width
    const isIPad = screenWidth > 700
    const columnCount = isIPad ? 4 : 2
    const gutterSize = isIPad ? 80 : 60
    const columnWidth = (screenWidth - gutterSize) / columnCount
    this.setState({ columnCount, columnWidth })
  }

  render() {
    const { item, section } = this.props
    const { columnCount, columnWidth } = this.state

    if (isEmpty(item.data)) {
      return null
    }

    const style = {
      marginTop: section.isFirstItem ? -9 : 0, // Offset spaced section headers
    }

    return (
      <View style={style} onLayout={this.onLayout}>
        <SectionHeader title={section.title} style={{ paddingTop: this.props.section.isFirstItem ? 0 : 22 }} />
        {columnCount > 0 ? (
          <FlatList
            contentContainerStyle={{
              justifyContent: "space-between",
              padding: 5,
              display: "flex",
            }}
            data={item.data}
            numColumns={columnCount}
            keyExtractor={row => row.__id}
            renderItem={row => <SaleListItem key={row.index} sale={row.item} containerWidth={columnWidth} />}
          />
        ) : null}
      </View>
    )
  }
}
