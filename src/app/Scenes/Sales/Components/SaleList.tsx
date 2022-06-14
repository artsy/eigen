import { isEmpty } from "lodash"
import React from "react"
import { View } from "react-native"

import { SaleListItem_sale$data } from "__generated__/SaleListItem_sale.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { FragmentRef } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import SaleListItem from "./SaleListItem"

export const SaleList: React.FC<{
  sales: Array<FragmentRef<SaleListItem_sale$data>>
  title: string
}> = ({ sales, title }) => {
  const { width } = useScreenDimensions()
  const isIPad = width > 700
  const columnCount = isIPad ? 4 : 2
  const gutterSize = (columnCount + 1) * 20
  const columnWidth = (width - gutterSize) / columnCount
  if (isEmpty(sales)) {
    return null
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <SectionTitle title={title} />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: -20,
        }}
      >
        {sales.map((sale, index) => (
          <SaleListItem
            key={index}
            sale={sale}
            containerWidth={columnWidth}
            index={index}
            columnCount={columnCount}
          />
        ))}
      </View>
    </View>
  )
}
