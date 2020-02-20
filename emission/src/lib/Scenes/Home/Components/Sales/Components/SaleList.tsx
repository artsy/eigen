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
  columnCount: number
  columnWidth: number
}

export class SaleList extends Component<Props, State> {
  constructor(props) {
    super(props)

    // We only need to check if this is an iPad once and then use onLayout for rotation
    const isIPad = Dimensions.get("window").width > 700
    const columnCount = isIPad ? 4 : 2

    this.state = {
      columnCount,
      columnWidth: 0,
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const screenWidth = event.nativeEvent.layout.width
    const isIPad = screenWidth > 700
    const gutterSize = isIPad ? 80 : 40
    const columnWidth = (screenWidth - gutterSize) / this.state.columnCount
    this.setState({ columnWidth })
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
        <SectionHeader title={section.title} />
        {columnCount > 0 ? (
          <FlatList
            contentContainerStyle={{
              justifyContent: "space-between",
              padding: 5,
              display: "flex",
            }}
            data={item.data}
            numColumns={columnCount}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={row => <SaleListItem key={row.index} sale={row.item} containerWidth={columnWidth} />}
          />
        ) : null}
      </View>
    )
  }
}
