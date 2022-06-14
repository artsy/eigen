import React from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"

import { SaleListItem_sale$data } from "__generated__/SaleListItem_sale.graphql"
import { formatDisplayTimelyAt } from "app/Scenes/Sale/helpers"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Sans } from "palette"

interface Props {
  sale: SaleListItem_sale$data
  containerWidth: number
  index: number
  columnCount: number
}

export const SaleListItem: React.FC<Props> = (props) => {
  const isCascadingEnabled = useFeatureFlag("AREnableCascadingEndTimerSalePageGrid")

  const handleTap = () => {
    const {
      sale: { liveURLIfOpen, href },
    } = props
    const url = (liveURLIfOpen || href) as string
    navigate(url)
  }

  const { sale, containerWidth, index, columnCount } = props
  const image = sale.coverImage
  const timestamp = isCascadingEnabled
    ? sale.formattedStartDateTime
    : formatDisplayTimelyAt(sale.displayTimelyAt)
  const isFirstItemInRow = index === 0 || index % columnCount === 0
  const marginLeft = isFirstItemInRow ? 0 : 20

  return (
    <TouchableOpacity onPress={handleTap}>
      <View
        style={{
          width: containerWidth,
          marginBottom: 20,
          marginLeft,
        }}
      >
        <OpaqueImageView
          style={{
            width: containerWidth,
            height: containerWidth,
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 5,
          }}
          imageURL={image && image.url}
        />
        <Sans size="3t" numberOfLines={2} weight="medium">
          {sale.name}
        </Sans>
        <Sans size="3" color="black60">
          {timestamp}
        </Sans>
      </View>
    </TouchableOpacity>
  )
}

export default createFragmentContainer(SaleListItem, {
  sale: graphql`
    fragment SaleListItem_sale on Sale {
      name
      href
      liveURLIfOpen
      liveStartAt
      displayTimelyAt
      formattedStartDateTime
      coverImage {
        url(version: "large")
      }
    }
  `,
})
